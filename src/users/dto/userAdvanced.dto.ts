import { IsAlphanumeric, Length } from "class-validator";
import { UserBaseDTO } from "./userBase";

export class UserAdvancedDTO extends UserBaseDTO {
    @IsAlphanumeric()
    @Length(8, 16)
    password: string;
}