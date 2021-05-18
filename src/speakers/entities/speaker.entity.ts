import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { VoiceEntity } from "../../users/voices/entities/voice.entity";

@Entity('speaker')
export class SpeakerEntity {
    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @Column('text', {name: 'model_path'})
    model_path: string;

    @OneToMany(() => VoiceEntity, voice => voice.speaker, {
        onDelete: 'CASCADE'
    })
    voices: VoiceEntity[];

    @OneToOne(() => UserEntity, user => user.speaker, {
        onDelete: 'CASCADE'
    })
    owner: UserEntity;
}