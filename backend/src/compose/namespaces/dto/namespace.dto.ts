import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateNamespaceDto {
  @ApiProperty({ example: 'Sales CRM' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'sales_crm', description: 'Unique alphanumeric identifier with underscores' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'handle must contain only letters, numbers, and underscores' })
  handle: string;

  @ApiProperty({ example: 'Main CRM for leads, contacts, and deals', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class UpdateNamespaceDto {
  @ApiProperty({ example: 'Sales CRM', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'sales_crm', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+$/)
  handle?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
