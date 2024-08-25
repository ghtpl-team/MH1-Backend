import { DateTimeType } from "@mikro-orm/core";
import { IsDateString } from "class-validator";

export class UserPreferencesDto{
    @IsDateString()
    breakfastTiming: string;

    @IsDateString()
    lunchTiming: string;

    @IsDateString()
    dinnerTiming: string;
}
