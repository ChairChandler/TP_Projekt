import { IsAlphanumeric, IsIn, IsOptional, Length } from "class-validator";
import { Roles } from "utils/roles";

export class UserDTO {
    @IsAlphanumeric()
    @Length(8, 16)
    name: string;

    @IsAlphanumeric()
    @Length(8, 16)
    password: string;

    @IsOptional()
    @IsIn([Roles.ADMIN])
    role: Roles;
}