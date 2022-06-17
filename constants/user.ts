export const USERNAME_MAX_LENGTH = 30;        // 사용자명 최대 길이
export const PASSWORD_MAX_LENGTH = 32;        // 비밀번호 최대 길이
export const PASSWORD_HASH_MAX_LENGTH = 60;   // 비밀번호(해시) 최대 길이
export const PASSWORD_SALT_ROUNDS = 12;       // 비밀번호 해시 난이도

export enum Type {
  ADMINISTRATOR = 'ADMINISTRATOR',          // 관리자
  NORMAL = 'NORMAL',                        // 일반
  GUEST = 'GUEST',                          // 손님
}
