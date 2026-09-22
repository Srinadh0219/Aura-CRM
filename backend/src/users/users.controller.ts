import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';
import { RoleType } from '../common/enums';

@ApiTags('Users & RBAC')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(RoleType.SUPERADMIN, RoleType.ADMIN)
  @ApiOperation({ summary: 'List all users (Admin only)' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/role')
  @Roles(RoleType.SUPERADMIN)
  @ApiOperation({ summary: 'Update user role (Superadmin only)' })
  async updateRole(@Param('id') id: string, @Body('role') role: RoleType) {
    return this.usersService.updateRole(id, role);
  }

  @Patch(':id/status')
  @Roles(RoleType.SUPERADMIN, RoleType.ADMIN)
  @ApiOperation({ summary: 'Activate or deactivate user (Admin only)' })
  async toggleActive(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.usersService.toggleActive(id, isActive);
  }
}
