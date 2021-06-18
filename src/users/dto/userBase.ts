import { IsAlphanumeric, IsIn, IsOptional, Length } from "class-validator";
import { Roles } from "utils/roles";

export class UserBaseDTO {
    @IsAlphanumeric()
    @Length(8, 16)
    name: string;

    @IsOptional()
    @IsIn([Roles.ADMIN])
    role: Roles;
}