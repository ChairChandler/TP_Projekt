import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('voice')
export class VoiceEntity {
    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @Column('text', {name: 'path'})
    path: string;

    @ManyToOne(() => UserEntity, user => user.voices, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ 
        name: "name", 
        referencedColumnName: "name"
    })
    owner: UserEntity;
}