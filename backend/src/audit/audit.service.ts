import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateAuditLogDto {
  userId?: string;
  userName: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, any>;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: CreateAuditLogDto) {
    try {
      return await this.prisma.auditLog.create({
        data: {
          userId: data.userId,
          userName: data.userName,
          userEmail: data.userEmail,
          action: data.action,
          entityType: data.entityType,
          entityId: data.entityId,
          details: data.details ? JSON.stringify(data.details) : null,
        },
      });
    } catch (err) {
      console.error('Failed to write audit log:', err);
    }
  }

  async findAll(limit: number = 50, entityType?: string, entityId?: string) {
    const where: any = {};
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;

    const logs = await this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 200),
    });

    return logs.map((log) => ({
      ...log,
      details: log.details ? JSON.parse(log.details) : null,
    }));
  }

  async getRecentStats() {
    const totalLogs = await this.prisma.auditLog.count();
    const recentLogs = await this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      totalLogs,
      recent: recentLogs.map((l) => ({
        ...l,
        details: l.details ? JSON.parse(l.details) : null,
      })),
    };
  }
}
