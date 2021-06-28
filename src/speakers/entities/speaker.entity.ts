import { UserEntity } from "src/users/entities/user.entity";
import { AfterLoad, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { VoiceEntity } from "../../users/voices/entities/voice.entity";

@Entity('speaker')
export class SpeakerEntity {
    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @Column('text', {name: 'model_path'})
    model_path: string;

    @OneToOne(() => UserEntity, user => user.speaker, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    owner: UserEntity;
}