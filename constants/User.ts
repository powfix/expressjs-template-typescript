// User type
export enum Type {
  SUPER_USER = 'SUPER_USER',
  NORMAL = 'NORMAL',
  GUEST = 'GUEST',
}

export const USERNAME_MAX_LENGTH = 30;        // 사용자명 최대 길이
export const PASSWORD_MAX_LENGTH = 32;        // 비밀번호 최대 길이
export const PASSWORD_HASH_MAX_LENGTH = 60;   // 비밀번호(해시) 최대 길이
