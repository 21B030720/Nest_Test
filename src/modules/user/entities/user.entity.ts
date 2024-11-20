import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier for the user', example: 1 })
  id: number;

  @Column()
  @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
  name: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'The email of the user', example: 'johndoe@example.com' })
  email: string;

  @Column()
  @ApiProperty({ description: 'The hashed password of the user' })
  password: string;

  @Column({ default: false })
  @ApiProperty({ description: 'The status of the user', example: false })
  status: boolean;
}