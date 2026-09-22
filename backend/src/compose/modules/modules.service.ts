import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';

@Injectable()
export class ModulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(namespaceId: string, dto: CreateModuleDto) {
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

    return this.prisma.module.create({
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

  async update(moduleId: string, dto: UpdateModuleDto) {
    await this.findOne(moduleId);
    return this.prisma.module.update({
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
  }

  async remove(moduleId: string) {
    await this.findOne(moduleId);
    return this.prisma.module.delete({ where: { id: moduleId } });
  }
}
