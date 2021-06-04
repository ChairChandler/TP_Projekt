import { IsAlphanumeric, Length } from "class-validator";

export class TokenDTO {
    @IsAlphanumeric()
    @Length(8, 16)
    password: string;
}