import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Get recent system audit logs' })
  async getLogs(
    @Query('limit') limit?: string,
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
  ) {
    const lim = limit ? parseInt(limit, 10) : 50;
    return this.auditService.findAll(lim, entityType, entityId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get audit activity summary' })
  async getStats() {
    return this.auditService.getRecentStats();
  }

  @Get('entity/:type/:id')
  @ApiOperation({ summary: 'Get audit history for a specific entity' })
  async getEntityLogs(@Param('type') type: string, @Param('id') id: string) {
    return this.auditService.findAll(50, type, id);
  }
}
