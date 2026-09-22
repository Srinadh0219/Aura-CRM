import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAutomationRuleDto {
  @ApiProperty({ example: 'mod-123' })
  @IsString()
  @IsNotEmpty()
  moduleId: string;

  @ApiProperty({ example: 'Auto-set High Priority on Won Deals' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'RECORD_CREATED', enum: ['RECORD_CREATED', 'RECORD_UPDATED'] })
  @IsString()
  @IsNotEmpty()
  triggerEvent: string;

  @ApiPropertyOptional({ example: 'stage' })
  @IsOptional()
  @IsString()
  conditionField?: string;

  @ApiPropertyOptional({ example: 'EQUALS', enum: ['EQUALS', 'NOT_EQUALS', 'CONTAINS'] })
  @IsOptional()
  @IsString()
  conditionOperator?: string;

  @ApiPropertyOptional({ example: 'Closed Won' })
  @IsOptional()
  @IsString()
  conditionValue?: string;

  @ApiProperty({ example: 'SET_FIELD', enum: ['SET_FIELD', 'NOTIFY', 'LOG_EVENT'] })
  @IsString()
  @IsNotEmpty()
  actionType: string;

  @ApiProperty({ example: '{"targetField":"priority","value":"High"}' })
  @IsString()
  @IsNotEmpty()
  actionPayload: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateAutomationRuleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  triggerEvent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  conditionField?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  conditionOperator?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  conditionValue?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actionType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actionPayload?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
