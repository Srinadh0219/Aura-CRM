import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FieldsService } from './fields.service';
import { CreateFieldDto, UpdateFieldDto } from './dto/field.dto';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { Roles } from '../../auth/roles.decorator';
import { RoleType } from '../../common/enums';

@ApiTags('Compose: Module Fields')
@Controller('compose/modules/:moduleId/fields')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  @Roles(RoleType.SUPERADMIN, RoleType.ADMIN)
  @ApiOperation({ summary: 'Add a new field to a module' })
  async create(
    @Param('moduleId') moduleId: string,
    @Body() dto: CreateFieldDto,
  ) {
    return this.fieldsService.create(moduleId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all fields in a module' })
  async findAll(@Param('moduleId') moduleId: string) {
    return this.fieldsService.findAll(moduleId);
  }

  @Get(':fieldId')
  @ApiOperation({ summary: 'Get field details' })
  async findOne(@Param('fieldId') fieldId: string) {
    return this.fieldsService.findOne(fieldId);
  }

  @Patch(':fieldId')
  @Roles(RoleType.SUPERADMIN, RoleType.ADMIN)
  @ApiOperation({ summary: 'Update field configuration' })
  async update(
    @Param('fieldId') fieldId: string,
    @Body() dto: UpdateFieldDto,
  ) {
    return this.fieldsService.update(fieldId, dto);
  }

  @Delete(':fieldId')
  @Roles(RoleType.SUPERADMIN, RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete a field from a module' })
  async remove(@Param('fieldId') fieldId: string) {
    return this.fieldsService.remove(fieldId);
  }
}
