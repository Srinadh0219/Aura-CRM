import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { FieldKind } from '../../../common/enums';

export class CreateFieldDto {
  @ApiProperty({ example: 'first_name', description: 'Unique field identifier in the module' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/)
  name: string;

  @ApiProperty({ example: 'First Name' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: 'String', enum: FieldKind })
  @IsEnum(FieldKind)
  kind: FieldKind;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isMulti?: boolean;

  @ApiProperty({ example: { options: ['New', 'Contacted', 'Qualified', 'Lost'] }, required: false })
  @IsOptional()
  options?: any;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateFieldDto {
  @ApiProperty({ example: 'First Name', required: false })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({ example: 'String', enum: FieldKind, required: false })
  @IsOptional()
  @IsEnum(FieldKind)
  kind?: FieldKind;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isMulti?: boolean;

  @ApiProperty({ example: { options: ['New', 'Qualified'] }, required: false })
  @IsOptional()
  options?: any;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  order?: number;
}
