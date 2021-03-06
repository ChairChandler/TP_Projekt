import { SpeakerEntity } from "src/speakers/entities/speaker.entity";
import { VoiceEntity } from "src/users/voices/entities/voice.entity";
import { AfterLoad, Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Roles } from "utils/roles";

@Entity('user')
export class UserEntity {
    @Index()
    @PrimaryColumn('varchar', {
        name: 'name',
        length: 16
    })
    name: string;

    @Column('varchar', {
        name: 'password_hash',
        length: 64
    })
    password_hash: string;

    @Column('varchar', {
        name: 'role',
        length: 16
    })
    role: Roles;

    @OneToMany(() => VoiceEntity, voice => voice.owner)
    voices: VoiceEntity[];

    @OneToOne(() => SpeakerEntity, speaker => speaker.owner, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    speaker: SpeakerEntity;
}