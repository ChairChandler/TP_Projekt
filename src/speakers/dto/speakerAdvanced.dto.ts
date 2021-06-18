import { IsString } from "class-validator";
import { SpeakerBaseDTO } from "./speakerBase.dto";

export class SpeakerAdvancedDTO extends SpeakerBaseDTO {
    @IsString({each: true})
    file_names: string[];
}