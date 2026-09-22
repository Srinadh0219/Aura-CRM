import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AutomationService } from './automation.service';
import { CreateAutomationRuleDto, UpdateAutomationRuleDto } from './dto/automation.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/roles.decorator';
import { RoleType } from '../common/enums';

@ApiTags('Automation Rules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('automations')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Post()
  @Roles(RoleType.SUPERADMIN, RoleType.ADMIN)
  @ApiOperation({ summary: 'Create a new automated workflow rule' })
  async create(@Body() dto: CreateAutomationRuleDto) {
    return this.automationService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all automation rules' })
  async findAll(@Query('moduleId') moduleId?: string) {
    return this.automationService.findAll(moduleId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific automation rule' })
  async findOne(@Param('id') id: string) {
    return this.automationService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleType.SUPERADMIN, RoleType.ADMIN)
  @ApiOperation({ summary: 'Update an automation rule' })
  async update(@Param('id') id: string, @Body() dto: UpdateAutomationRuleDto) {
    return this.automationService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleType.SUPERADMIN, RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete an automation rule' })
  async remove(@Param('id') id: string) {
    return this.automationService.remove(id);
  }
}
