import { SetMetadata } from "@nestjs/common";

export enum Roles {
    USER = 'USER',
    HEAD_ADMIN = 'HEAD_ADMIN',
    ADMIN = 'ADMIN'
}

export const ROLE_META_KEY = 'Required-One-Of-Role';
export const Role = (names: Roles[]) => SetMetadata(ROLE_META_KEY, names);