import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoleType } from '../common/enums';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateRole(id: string, role: RoleType, currentUser?: any) {
    const targetUser = await this.findOne(id);
    const updated = await this.prisma.user.update({
      where: { id },
      data: { role: role.toString() },
      select: { id: true, email: true, role: true },
    });

    await this.auditService.log({
      userId: currentUser?.id,
      userName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Superadmin',
      userEmail: currentUser?.email || 'admin@auracrm.local',
      action: 'UPDATE_ROLE',
      entityType: 'USER',
      entityId: id,
      details: {
        targetUserEmail: targetUser.email,
        oldRole: targetUser.role,
        newRole: role.toString(),
      },
    });

    return updated;
  }

  async toggleActive(id: string, isActive: boolean, currentUser?: any) {
    const targetUser = await this.findOne(id);
    const updated = await this.prisma.user.update({
      where: { id },
      data: { isActive },
      select: { id: true, email: true, isActive: true },
    });

    await this.auditService.log({
      userId: currentUser?.id,
      userName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Superadmin',
      userEmail: currentUser?.email || 'admin@auracrm.local',
      action: isActive ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
      entityType: 'USER',
      entityId: id,
      details: {
        targetUserEmail: targetUser.email,
        status: isActive ? 'Active' : 'Inactive',
      },
    });

    return updated;
  }
}
