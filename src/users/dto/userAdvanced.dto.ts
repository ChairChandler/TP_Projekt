import { Optional } from "@nestjs/common";
import { IsAlphanumeric, Length } from "class-validator";
import { UserBaseDTO, UserBaseEditDTO } from "./userBase";

export class UserAdvancedDTO extends UserBaseDTO {
    @IsAlphanumeric()
    @Length(8, 16)
    password: string;
}

export class UserAdvancedEditDTO extends UserBaseEditDTO {
    @IsAlphanumeric()
    @Length(8, 16)
    @Optional()
    password?: string;
}