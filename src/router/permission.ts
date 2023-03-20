import type { Router } from 'vue-router'
import { useAuthStoreWithout } from '@/store/modules/auth'
import { useAuthStore } from '@/store'
export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStoreWithout()
    // if(!authStore.session)
    if (useAuthStore().loginToken) {
      // next()
      try {
        // debugger
        const data = await authStore.getSession()
        if (String(data.auth) === 'false' && authStore.token)
          authStore.removeToken()
        next()
      }
      catch (error) {
        // 出错去往登录页面
        if (to.path !== '/500')
          next({ name: '500' })
        else
          next()
      }
    }
    else {
      // 没有token去往登录页
      next()
    }
  })
}
