import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNamespaceDto, UpdateNamespaceDto } from './dto/namespace.dto';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class NamespacesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateNamespaceDto, user?: any) {
    const existing = await this.prisma.namespace.findUnique({
      where: { handle: dto.handle.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException(`Namespace with handle '${dto.handle}' already exists`);
    }

    const created = await this.prisma.namespace.create({
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

    await this.auditService.log({
      userId: user?.id,
      userName: user ? `${user.firstName} ${user.lastName}` : 'System',
      userEmail: user?.email || 'system@auracrm.local',
      action: 'CREATE_NAMESPACE',
      entityType: 'NAMESPACE',
      entityId: created.id,
      details: {
        name: created.name,
        handle: created.handle,
      },
    });

    return created;
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

  async update(id: string, dto: UpdateNamespaceDto, user?: any) {
    await this.findOne(id);
    const updated = await this.prisma.namespace.update({
      where: { id },
      data: {
        name: dto.name,
        handle: dto.handle?.toLowerCase(),
        description: dto.description,
        enabled: dto.enabled,
      },
    });

    await this.auditService.log({
      userId: user?.id,
      userName: user ? `${user.firstName} ${user.lastName}` : 'System',
      userEmail: user?.email || 'system@auracrm.local',
      action: 'UPDATE_NAMESPACE',
      entityType: 'NAMESPACE',
      entityId: id,
      details: { name: updated.name },
    });

    return updated;
  }

  async remove(id: string, user?: any) {
    const ns = await this.findOne(id);
    const deleted = await this.prisma.namespace.delete({ where: { id } });

    await this.auditService.log({
      userId: user?.id,
      userName: user ? `${user.firstName} ${user.lastName}` : 'System',
      userEmail: user?.email || 'system@auracrm.local',
      action: 'DELETE_NAMESPACE',
      entityType: 'NAMESPACE',
      entityId: id,
      details: { name: ns.name },
    });

    return deleted;
  }
}
