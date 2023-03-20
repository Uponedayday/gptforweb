import { defineStore } from 'pinia'
import { getToken, removeToken, setToken ,getLoginToken,setLoginToken,removeLoginToken} from './helper'
import { store } from '@/store'
import { fetchSession } from '@/api'

interface SessionResponse {
  auth: boolean
  model: 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI'
}

export interface AuthState {
  token: string | undefined
  loginToken: string | undefined
  session: SessionResponse | null
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    loginToken:getLoginToken(),
    session: null,
  }),

  getters: {
    isChatGPTAPI(state): boolean {
      return state.session?.model === 'ChatGPTAPI'
    },
  },

  actions: {
    async getSession() {
      try {
        const { data } = await fetchSession<SessionResponse>()
        this.session = { ...data }
        return Promise.resolve(data)
      }
      catch (error) {
        return Promise.reject(error)
      }
    },

    // async login() {
    //   try {
    //     // 登录接口返回token

    //   } catch (error) {

    //   }
    // }

    setToken(token: string) {
      this.token = token
      setToken(token)
    },

    removeToken() {
      this.token = undefined
      removeToken()
    },

    setLoginToken(token: string) {
      this.loginToken = token
      setLoginToken(token)
    },

    removeLoginToken() {
      this.loginToken = undefined
      removeLoginToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
