import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFieldDto, UpdateFieldDto } from './dto/field.dto';

@Injectable()
export class FieldsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(moduleId: string, dto: CreateFieldDto) {
    const mod = await this.prisma.module.findUnique({ where: { id: moduleId } });
    if (!mod) throw new NotFoundException(`Module ${moduleId} not found`);

    const existing = await this.prisma.moduleField.findUnique({
      where: {
        moduleId_name: {
          moduleId,
          name: dto.name.toLowerCase(),
        },
      },
    });
    if (existing) {
      throw new ConflictException(`Field '${dto.name}' already exists in this module`);
    }

    const optionsStr = dto.options ? (typeof dto.options === 'string' ? dto.options : JSON.stringify(dto.options)) : null;

    const field = await this.prisma.moduleField.create({
      data: {
        moduleId,
        name: dto.name.toLowerCase(),
        label: dto.label,
        kind: dto.kind.toString(),
        isRequired: dto.isRequired ?? false,
        isMulti: dto.isMulti ?? false,
        options: optionsStr,
        order: dto.order ?? 0,
      },
    });

    return this.formatField(field);
  }

  async findAll(moduleId: string) {
    const fields = await this.prisma.moduleField.findMany({
      where: { moduleId },
      orderBy: { order: 'asc' },
    });
    return fields.map((f) => this.formatField(f));
  }

  async findOne(fieldId: string) {
    const field = await this.prisma.moduleField.findUnique({
      where: { id: fieldId },
    });
    if (!field) throw new NotFoundException(`Field ${fieldId} not found`);
    return this.formatField(field);
  }

  async update(fieldId: string, dto: UpdateFieldDto) {
    await this.findOne(fieldId);
    const optionsStr = dto.options !== undefined 
      ? (typeof dto.options === 'string' ? dto.options : JSON.stringify(dto.options))
      : undefined;

    const field = await this.prisma.moduleField.update({
      where: { id: fieldId },
      data: {
        label: dto.label,
        kind: dto.kind ? dto.kind.toString() : undefined,
        isRequired: dto.isRequired,
        isMulti: dto.isMulti,
        options: optionsStr,
        order: dto.order,
      },
    });
    return this.formatField(field);
  }

  async remove(fieldId: string) {
    await this.findOne(fieldId);
    return this.prisma.moduleField.delete({ where: { id: fieldId } });
  }

  private formatField(f: any) {
    let parsedOptions = null;
    if (f.options) {
      try {
        parsedOptions = JSON.parse(f.options);
      } catch {
        parsedOptions = f.options;
      }
    }
    return {
      ...f,
      options: parsedOptions,
    };
  }
}
