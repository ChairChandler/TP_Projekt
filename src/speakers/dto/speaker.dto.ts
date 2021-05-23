import { IsAlphanumeric, Length } from "class-validator";

export class SpeakerDTO {
    @IsAlphanumeric()
    @Length(8, 16)
    owner: string;
}