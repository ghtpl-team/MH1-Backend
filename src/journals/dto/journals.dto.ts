import { DateType } from "@mikro-orm/core";
import { IsDateString, IsNumber, IsString } from "class-validator";

export class CreateJournalEntryDTO{

    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsDateString()
    data?: DateType;
}