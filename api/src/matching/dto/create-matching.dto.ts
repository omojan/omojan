import { IsNotEmpty, IsInt, IsString, Max, Min } from 'class-validator';

export class CreateMatchingDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(10)
  @Max(60)
  timeLimit: number;

  @IsNotEmpty()
  @IsInt()
  @Min(3)
  @Max(6)
  playerCount: number;

  @IsNotEmpty()
  @IsInt()
  @Min(3)
  @Max(6)
  turnCount: number;

  @IsString()
  password: string;
}
