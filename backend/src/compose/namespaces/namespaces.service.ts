import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNamespaceDto, UpdateNamespaceDto } from './dto/namespace.dto';

@Injectable()
export class NamespacesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNamespaceDto) {
    const existing = await this.prisma.namespace.findUnique({
      where: { handle: dto.handle.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException(`Namespace with handle '${dto.handle}' already exists`);
    }

    return this.prisma.namespace.create({
      data: {
        name: dto.name,
        handle: dto.handle.toLowerCase(),
        description: dto.description,
        enabled: dto.enabled ?? true,
      },
      include: {
        _count: { select: { modules: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.namespace.findMany({
      include: {
        _count: { select: { modules: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(idOrHandle: string) {
    const namespace = await this.prisma.namespace.findFirst({
      where: {
        OR: [{ id: idOrHandle }, { handle: idOrHandle.toLowerCase() }],
      },
      include: {
        modules: {
          include: {
            fields: { orderBy: { order: 'asc' } },
            _count: { select: { records: true } },
          },
        },
      },
    });

    if (!namespace) {
      throw new NotFoundException(`Namespace '${idOrHandle}' not found`);
    }
    return namespace;
  }

  async update(id: string, dto: UpdateNamespaceDto) {
    await this.findOne(id);
    return this.prisma.namespace.update({
      where: { id },
      data: {
        name: dto.name,
        handle: dto.handle?.toLowerCase(),
        description: dto.description,
        enabled: dto.enabled,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.namespace.delete({ where: { id } });
  }
}
