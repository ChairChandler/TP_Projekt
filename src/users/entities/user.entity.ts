import { SpeakerEntity } from "src/speakers/entities/speaker.entity";
import { VoiceEntity } from "src/users/voices/entities/voice.entity";
import { Column, Entity, Index, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
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
        name: 'password',
        length: 16
    })
    password: string;

    @Column('varchar', {
        name: 'role',
        length: 16
    })
    role: Roles;

    @OneToMany(() => VoiceEntity, voice => voice.speaker, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    voices: VoiceEntity[];

    @OneToOne(() => SpeakerEntity, speaker => speaker.owner, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    speaker: SpeakerEntity;
}