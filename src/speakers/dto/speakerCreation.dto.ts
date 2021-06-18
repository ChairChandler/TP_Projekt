import { IsAlphanumeric, Length } from "class-validator";

export class SpeakerCreationDTO {
    @IsAlphanumeric()
    @Length(8, 16)
    owner: string;
}