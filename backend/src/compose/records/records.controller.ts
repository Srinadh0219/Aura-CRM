import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RecordsService } from './records.service';
import { CreateRecordDto, QueryRecordDto, UpdateRecordDto } from './dto/record.dto';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { CurrentUser } from '../../auth/current-user.decorator';

@ApiTags('Compose: Records (CRM Data)')
@Controller('compose/modules/:moduleId/records')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new record in a module' })
  async create(
    @Param('moduleId') moduleId: string,
    @Body() dto: CreateRecordDto,
    @CurrentUser() user: any,
  ) {
    return this.recordsService.create(moduleId, dto, user);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk import records from CSV/JSON' })
  async bulkCreate(
    @Param('moduleId') moduleId: string,
    @Body() body: { items: Array<Record<string, any>> },
    @CurrentUser() user: any,
  ) {
    return this.recordsService.bulkCreate(moduleId, body.items || [], user);
  }

  @Get()
  @ApiOperation({ summary: 'Query and list records with pagination & search' })
  async findAll(
    @Param('moduleId') moduleId: string,
    @Query() queryDto: QueryRecordDto,
  ) {
    return this.recordsService.findAll(moduleId, queryDto);
  }

  @Get(':recordId')
  @ApiOperation({ summary: 'Get a specific record with creator details' })
  async findOne(
    @Param('moduleId') moduleId: string,
    @Param('recordId') recordId: string,
  ) {
    return this.recordsService.findOne(moduleId, recordId);
  }

  @Patch(':recordId')
  @ApiOperation({ summary: 'Update record fields' })
  async update(
    @Param('moduleId') moduleId: string,
    @Param('recordId') recordId: string,
    @Body() dto: UpdateRecordDto,
    @CurrentUser() user: any,
  ) {
    return this.recordsService.update(moduleId, recordId, dto, user);
  }

  @Delete(':recordId')
  @ApiOperation({ summary: 'Delete a record' })
  async remove(
    @Param('moduleId') moduleId: string,
    @Param('recordId') recordId: string,
    @CurrentUser() user: any,
  ) {
    return this.recordsService.remove(moduleId, recordId, user);
  }
}
