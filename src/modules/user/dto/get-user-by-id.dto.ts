import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class GetUserByIdDto {

  @ApiProperty({ description: 'User ID', example: '1' })
  @IsInt()
  @Min(1)
  id: number;

}
