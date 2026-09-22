import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({ example: 'Leads' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'leads', description: 'Unique handle inside the namespace' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/)
  handle: string;

  @ApiProperty({ example: 'Stores all potential customer leads', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateModuleDto {
  @ApiProperty({ example: 'Leads', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'leads', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+$/)
  handle?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
