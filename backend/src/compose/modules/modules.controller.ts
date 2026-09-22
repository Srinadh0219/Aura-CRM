import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { Roles } from '../../auth/roles.decorator';
import { RoleType } from '../../common/enums';
import { CurrentUser } from '../../auth/current-user.decorator';

@ApiTags('Compose: Modules')
@Controller('compose/namespaces/:namespaceId/modules')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  @Roles(RoleType.SUPERADMIN, RoleType.ADMIN)
  @ApiOperation({ summary: 'Create a module in a namespace' })
  async create(
    @Param('namespaceId') namespaceId: string,
    @Body() dto: CreateModuleDto,
    @CurrentUser() user: any,
  ) {
    return this.modulesService.create(namespaceId, dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List all modules in a namespace' })
  async findAll(@Param('namespaceId') namespaceId: string) {
    return this.modulesService.findAll(namespaceId);
  }

  @Get(':moduleId')
  @ApiOperation({ summary: 'Get module details with fields' })
  async findOne(@Param('moduleId') moduleId: string) {
    return this.modulesService.findOne(moduleId);
  }

  @Patch(':moduleId')
  @Roles(RoleType.SUPERADMIN, RoleType.ADMIN)
  @ApiOperation({ summary: 'Update module metadata' })
  async update(
    @Param('moduleId') moduleId: string,
    @Body() dto: UpdateModuleDto,
    @CurrentUser() user: any,
  ) {
    return this.modulesService.update(moduleId, dto, user);
  }

  @Delete(':moduleId')
  @Roles(RoleType.SUPERADMIN, RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete a module' })
  async remove(
    @Param('moduleId') moduleId: string,
    @CurrentUser() user: any,
  ) {
    return this.modulesService.remove(moduleId, user);
  }
}
