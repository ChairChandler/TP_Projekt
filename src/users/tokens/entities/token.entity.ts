import { UserEntity } from "src/users/entities/user.entity";
import { Entity, Index, OneToOne, PrimaryColumn } from "typeorm";

@Entity('token')
export class TokenEntity {
    @Index()
    @PrimaryColumn('varchar', {
        name: 'token',
        length: 32
    })
    token: string;

    @OneToOne(() => UserEntity, user => user.name, {
        onDelete: 'CASCADE'
    })
    user: UserEntity;
}