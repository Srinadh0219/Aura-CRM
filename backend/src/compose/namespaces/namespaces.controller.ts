import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NamespacesService } from './namespaces.service';
import { CreateNamespaceDto, UpdateNamespaceDto } from './dto/namespace.dto';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { Roles } from '../../auth/roles.decorator';
import { RoleType } from '../../common/enums';
import { CurrentUser } from '../../auth/current-user.decorator';

@ApiTags('Compose: Namespaces')
@Controller('compose/namespaces')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NamespacesController {
  constructor(private readonly namespacesService: NamespacesService) {}

  @Post()
  @Roles(RoleType.SUPERADMIN, RoleType.ADMIN)
  @ApiOperation({ summary: 'Create a new application namespace' })
  async create(
    @Body() dto: CreateNamespaceDto,
    @CurrentUser() user: any,
  ) {
    return this.namespacesService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List all application namespaces' })
  async findAll() {
    return this.namespacesService.findAll();
  }

  @Get(':idOrHandle')
  @ApiOperation({ summary: 'Get namespace with modules and fields' })
  async findOne(@Param('idOrHandle') idOrHandle: string) {
    return this.namespacesService.findOne(idOrHandle);
  }

  @Patch(':id')
  @Roles(RoleType.SUPERADMIN, RoleType.ADMIN)
  @ApiOperation({ summary: 'Update namespace details' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateNamespaceDto,
    @CurrentUser() user: any,
  ) {
    return this.namespacesService.update(id, dto, user);
  }

  @Delete(':id')
  @Roles(RoleType.SUPERADMIN)
  @ApiOperation({ summary: 'Delete a namespace' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.namespacesService.remove(id, user);
  }
}
