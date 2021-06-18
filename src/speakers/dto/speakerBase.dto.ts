import { IsNumber } from "class-validator";
import { SpeakerCreationDTO } from "./speakerCreation.dto";

export class SpeakerBaseDTO extends SpeakerCreationDTO {
    @IsNumber()
    id: number;
}