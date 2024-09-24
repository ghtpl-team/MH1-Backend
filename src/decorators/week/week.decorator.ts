import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IsInt, Max, Min, validateSync } from 'class-validator';

class WeekDto {
  @IsInt()
  @Min(1)
  @Max(42)
  week: number;
}

export const Week = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const weekString = request.params.week;

    const weekNumber = parseInt(weekString, 10);

    if (isNaN(weekNumber)) {
      throw new BadRequestException('Week must be a valid number');
    }

    const weekDto = plainToClass(WeekDto, { week: weekNumber });
    const errors = validateSync(weekDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return weekNumber;
  },
);
