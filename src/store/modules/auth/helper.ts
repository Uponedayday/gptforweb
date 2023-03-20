import { ss,ls } from '@/utils/storage'

const LOCAL_NAME = 'SECRET_TOKEN'
const LOGIN_TOKEN = 'LOGIN_TOKEN'
export function getToken() {
  return ss.get(LOCAL_NAME)
}

export function setToken(token: string) {
  return ss.set(LOCAL_NAME, token)
}

export function removeToken() {
  return ss.remove(LOCAL_NAME)
}

export function getLoginToken() {
  return ls.get(LOGIN_TOKEN)
}

export function setLoginToken(token: string) {
  return ls.set(LOGIN_TOKEN, token)
}

export function removeLoginToken() {
  return ls.remove(LOGIN_TOKEN)
}
