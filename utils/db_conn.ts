import { SpeakerEntity } from "src/speakers/entities/speaker.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { VoiceEntity } from "src/users/voices/entities/voice.entity";
import { Connection, createConnection } from "typeorm";

export class Database {
    public static readonly singleton: Database = new Database();
    public readonly conn: Promise<Connection>;

    constructor() {
        this.conn = createConnection({
            type: "sqlite",
            database: "tp",
            entities: [
                UserEntity, VoiceEntity, SpeakerEntity
            ],
            synchronize: true, // TODO: !! USUNAC W PRODUKCJI
            logging: false
          });
    }
}