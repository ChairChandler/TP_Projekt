import { SetMetadata } from "@nestjs/common";

export enum Roles {
    HEAD_ADMIN = 'HEAD_ADMIN',
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export const Role = (names: Roles[]) => SetMetadata('Required-One-Of-Role', names)