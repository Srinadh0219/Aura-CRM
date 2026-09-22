import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class ModulesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(namespaceId: string, dto: CreateModuleDto, user?: any) {
    const namespace = await this.prisma.namespace.findUnique({ where: { id: namespaceId } });
    if (!namespace) throw new NotFoundException(`Namespace ${namespaceId} not found`);

    const existing = await this.prisma.module.findUnique({
      where: {
        namespaceId_handle: {
          namespaceId,
          handle: dto.handle.toLowerCase(),
        },
      },
    });
    if (existing) {
      throw new ConflictException(`Module '${dto.handle}' already exists in this namespace`);
    }

    const createdModule = await this.prisma.module.create({
      data: {
        namespaceId,
        name: dto.name,
        handle: dto.handle.toLowerCase(),
        description: dto.description,
      },
      include: {
        fields: true,
        _count: { select: { records: true } },
      },
    });

    // Write Audit Log
    await this.auditService.log({
      userId: user?.id,
      userName: user ? `${user.firstName} ${user.lastName}` : 'System',
      userEmail: user?.email || 'system@auracrm.local',
      action: 'CREATE_MODULE',
      entityType: 'MODULE',
      entityId: createdModule.id,
      details: {
        moduleName: createdModule.name,
        moduleHandle: createdModule.handle,
        namespaceName: namespace.name,
      },
    });

    return createdModule;
  }

  async findAll(namespaceId: string) {
    return this.prisma.module.findMany({
      where: { namespaceId },
      include: {
        fields: { orderBy: { order: 'asc' } },
        _count: { select: { records: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(moduleId: string) {
    const mod = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        namespace: true,
        fields: { orderBy: { order: 'asc' } },
        _count: { select: { records: true } },
      },
    });
    if (!mod) throw new NotFoundException(`Module ${moduleId} not found`);
    return mod;
  }

  async update(moduleId: string, dto: UpdateModuleDto, user?: any) {
    await this.findOne(moduleId);
    const updated = await this.prisma.module.update({
      where: { id: moduleId },
      data: {
        name: dto.name,
        handle: dto.handle?.toLowerCase(),
        description: dto.description,
      },
      include: {
        fields: { orderBy: { order: 'asc' } },
      },
    });

    await this.auditService.log({
      userId: user?.id,
      userName: user ? `${user.firstName} ${user.lastName}` : 'System',
      userEmail: user?.email || 'system@auracrm.local',
      action: 'UPDATE_MODULE',
      entityType: 'MODULE',
      entityId: moduleId,
      details: {
        moduleName: updated.name,
      },
    });

    return updated;
  }

  async remove(moduleId: string, user?: any) {
    const mod = await this.findOne(moduleId);
    const deleted = await this.prisma.module.delete({ where: { id: moduleId } });

    await this.auditService.log({
      userId: user?.id,
      userName: user ? `${user.firstName} ${user.lastName}` : 'System',
      userEmail: user?.email || 'system@auracrm.local',
      action: 'DELETE_MODULE',
      entityType: 'MODULE',
      entityId: moduleId,
      details: {
        moduleName: mod.name,
      },
    });

    return deleted;
  }
}
