import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRecordDto, QueryRecordDto, UpdateRecordDto } from './dto/record.dto';
import { FieldKind } from '../../common/enums';
import { AuditService } from '../../audit/audit.service';
import { AutomationService } from '../../automation/automation.service';

@Injectable()
export class RecordsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly automationService: AutomationService,
  ) {}

  async create(moduleId: string, dto: CreateRecordDto, user?: any) {
    const mod = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: { fields: true },
    });
    if (!mod) throw new NotFoundException(`Module ${moduleId} not found`);

    let sanitizedValues = this.validateAndSanitize(mod.fields, dto.values);

    // Evaluate Automation Triggers on creation
    sanitizedValues = await this.automationService.evaluateRules(
      'RECORD_CREATED',
      moduleId,
      sanitizedValues,
      user,
    );

    const record = await this.prisma.record.create({
      data: {
        moduleId,
        values: JSON.stringify(sanitizedValues),
        createdById: user?.id,
        updatedById: user?.id,
      },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    // Write Audit Log
    await this.auditService.log({
      userId: user?.id,
      userName: user ? `${user.firstName} ${user.lastName}` : 'System',
      userEmail: user?.email || 'system@auracrm.local',
      action: 'CREATE_RECORD',
      entityType: 'RECORD',
      entityId: record.id,
      details: {
        moduleName: mod.name,
        moduleHandle: mod.handle,
        createdValues: sanitizedValues,
      },
    });

    return this.formatRecord(record);
  }

  async bulkCreate(moduleId: string, items: Array<Record<string, any>>, user?: any) {
    const mod = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: { fields: true },
    });
    if (!mod) throw new NotFoundException(`Module ${moduleId} not found`);

    const createdRecords = [];
    let successCount = 0;

    for (const rawValues of items) {
      try {
        let sanitized = this.validateAndSanitize(mod.fields, rawValues);
        sanitized = await this.automationService.evaluateRules(
          'RECORD_CREATED',
          moduleId,
          sanitized,
          user,
        );

        const record = await this.prisma.record.create({
          data: {
            moduleId,
            values: JSON.stringify(sanitized),
            createdById: user?.id,
            updatedById: user?.id,
          },
        });
        createdRecords.push(record);
        successCount++;
      } catch (err) {
        console.warn('Skipping invalid bulk record:', err);
      }
    }

    // Write Audit Log for bulk import
    await this.auditService.log({
      userId: user?.id,
      userName: user ? `${user.firstName} ${user.lastName}` : 'System',
      userEmail: user?.email || 'system@auracrm.local',
      action: 'BULK_IMPORT_CSV',
      entityType: 'MODULE',
      entityId: moduleId,
      details: {
        moduleName: mod.name,
        importedCount: successCount,
        totalAttempted: items.length,
      },
    });

    return {
      message: `Successfully imported ${successCount} records into ${mod.name}`,
      imported: successCount,
      total: items.length,
    };
  }

  async findAll(moduleId: string, queryDto: QueryRecordDto) {
    const mod = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: { fields: true },
    });
    if (!mod) throw new NotFoundException(`Module ${moduleId} not found`);

    const page = Number(queryDto.page) || 1;
    const limit = Number(queryDto.limit) || 20;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      moduleId,
      deletedAt: null,
    };

    const [total, rawRecords] = await Promise.all([
      this.prisma.record.count({ where: whereClause }),
      this.prisma.record.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          [queryDto.sortBy || 'createdAt']: queryDto.sortOrder || 'desc',
        },
        include: {
          createdBy: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      }),
    ]);

    let records = rawRecords.map((r) => this.formatRecord(r));

    // In-memory text search across JSON values if query is provided
    if (queryDto.query) {
      const q = queryDto.query.toLowerCase();
      records = records.filter((r: any) => {
        const str = JSON.stringify(r.values).toLowerCase();
        return str.includes(q);
      });
    }

    const formattedFields = mod.fields.map((f: any) => {
      let parsedOptions = null;
      if (f.options) {
        try {
          parsedOptions = JSON.parse(f.options);
        } catch {
          parsedOptions = f.options;
        }
      }
      return { ...f, options: parsedOptions };
    });

    return {
      data: records,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      module: {
        id: mod.id,
        name: mod.name,
        handle: mod.handle,
        fields: formattedFields,
      },
    };
  }

  async findOne(moduleId: string, recordId: string) {
    const record = await this.prisma.record.findFirst({
      where: { id: recordId, moduleId, deletedAt: null },
      include: {
        module: {
          include: { fields: { orderBy: { order: 'asc' } } },
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        updatedBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    if (!record) throw new NotFoundException(`Record ${recordId} not found`);
    return this.formatRecord(record);
  }

  async update(moduleId: string, recordId: string, dto: UpdateRecordDto, user?: any) {
    const record = await this.findOne(moduleId, recordId);
    const mod = record.module;

    const currentValues = (record.values as Record<string, any>) || {};
    let mergedValues = { ...currentValues, ...dto.values };
    let sanitizedValues = this.validateAndSanitize(mod.fields, mergedValues);

    // Evaluate Automation Triggers on update
    sanitizedValues = await this.automationService.evaluateRules(
      'RECORD_UPDATED',
      moduleId,
      sanitizedValues,
      user,
    );

    // Calculate diff between before and after
    const diff: Record<string, { from: any; to: any }> = {};
    for (const key of Object.keys(sanitizedValues)) {
      if (currentValues[key] !== sanitizedValues[key]) {
        diff[key] = { from: currentValues[key] || null, to: sanitizedValues[key] };
      }
    }

    const updated = await this.prisma.record.update({
      where: { id: recordId },
      data: {
        values: JSON.stringify(sanitizedValues),
        updatedById: user?.id,
      },
      include: {
        updatedBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    // Write Audit Log
    if (Object.keys(diff).length > 0) {
      await this.auditService.log({
        userId: user?.id,
        userName: user ? `${user.firstName} ${user.lastName}` : 'System',
        userEmail: user?.email || 'system@auracrm.local',
        action: 'UPDATE_RECORD',
        entityType: 'RECORD',
        entityId: recordId,
        details: {
          moduleName: mod.name,
          diff,
        },
      });
    }

    return this.formatRecord(updated);
  }

  async remove(moduleId: string, recordId: string, user?: any) {
    const record = await this.findOne(moduleId, recordId);
    const updated = await this.prisma.record.update({
      where: { id: recordId },
      data: { deletedAt: new Date() },
    });

    await this.auditService.log({
      userId: user?.id,
      userName: user ? `${user.firstName} ${user.lastName}` : 'System',
      userEmail: user?.email || 'system@auracrm.local',
      action: 'DELETE_RECORD',
      entityType: 'RECORD',
      entityId: recordId,
      details: {
        moduleName: record.module.name,
      },
    });

    return updated;
  }

  private formatRecord(r: any) {
    let parsedValues = {};
    if (typeof r.values === 'string') {
      try {
        parsedValues = JSON.parse(r.values);
      } catch {
        parsedValues = {};
      }
    } else if (typeof r.values === 'object' && r.values !== null) {
      parsedValues = r.values;
    }
    return {
      ...r,
      values: parsedValues,
    };
  }

  private validateAndSanitize(fields: any[], inputValues: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const field of fields) {
      const val = inputValues[field.name];

      // Required field check
      if (field.isRequired && (val === undefined || val === null || val === '')) {
        throw new BadRequestException(`Field '${field.label}' (${field.name}) is required`);
      }

      if (val === undefined || val === null) {
        continue;
      }

      // Type coercion / validation
      switch (field.kind) {
        case FieldKind.Number:
          const num = Number(val);
          if (isNaN(num)) {
            throw new BadRequestException(`Field '${field.label}' must be a valid number`);
          }
          sanitized[field.name] = num;
          break;

        case FieldKind.Boolean:
          sanitized[field.name] = Boolean(val);
          break;

        case FieldKind.DateTime:
          const d = new Date(val);
          if (isNaN(d.getTime())) {
            throw new BadRequestException(`Field '${field.label}' must be a valid date/time`);
          }
          sanitized[field.name] = d.toISOString();
          break;

        default:
          sanitized[field.name] = val;
      }
    }

    for (const [k, v] of Object.entries(inputValues)) {
      if (!(k in sanitized) && v !== undefined) {
        sanitized[k] = v;
      }
    }

    return sanitized;
  }
}
