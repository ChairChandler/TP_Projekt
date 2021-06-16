import { IsAlphanumeric, Length } from "class-validator";

export class TokenDTO {
    @IsAlphanumeric()
    @Length(1, 16)
    password: string;
}