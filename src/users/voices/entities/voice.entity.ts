import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SpeakerEntity } from "../../../speakers/entities/speaker.entity";

@Entity('voice')
export class VoiceEntity {
    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @Column('text', {name: 'path'})
    path: string;

    @ManyToOne(() => UserEntity, user => user.voices, {
        onDelete: 'CASCADE'
    })
    owner: UserEntity;

    @ManyToOne(() => SpeakerEntity, speaker => speaker.voices, {
        nullable: true,
        onDelete: 'SET NULL'    
    })
    speaker: SpeakerEntity;
}