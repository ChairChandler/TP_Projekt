import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity('token')
export class TokenEntity {
    @Index()
    @PrimaryColumn('varchar', {
        name: 'token',
        length: 32
    })
    token: string;

    @Column({type: 'datetime'})
    expires: Date;

    @OneToOne(() => UserEntity, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    user: UserEntity;
}