import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRecordDto {
  @ApiProperty({
    example: {
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane.doe@example.com',
      company: 'Acme Corp',
      deal_value: 75000,
      status: 'Qualified',
    },
    description: 'Dynamic key-value pairs matching module fields',
  })
  @IsObject()
  @IsNotEmpty()
  values: Record<string, any>;
}

export class UpdateRecordDto {
  @ApiProperty({
    example: {
      deal_value: 85000,
      status: 'Negotiation',
    },
    description: 'Updated field values',
  })
  @IsObject()
  @IsNotEmpty()
  values: Record<string, any>;
}

export class QueryRecordDto {
  @ApiProperty({ example: 1, required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ example: 20, required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiProperty({ example: 'Acme', required: false, description: 'Search across string fields' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({ example: 'createdAt', required: false, default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ example: 'desc', required: false, enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
