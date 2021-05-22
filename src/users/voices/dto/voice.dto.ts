import { IsNumber, IsString } from "class-validator";

export class VoiceDTO {
    @IsNumber()
    id: number;

    @IsString()
    path: string;
}