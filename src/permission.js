import router, {constantRoutes} from './router'
import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress' //  Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import {getToken} from '@/utils/auth' // 验权
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({showSpinner: false}) // NProgress Configuration

const whiteList = ['/login', '/register', '/404'] //  不重定向白名单

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 判断用户是否已登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，则重定向到首页
      next({path: '/'})
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          const data = await store.dispatch('user/getInfo') //第一步
          let arr = [];
          if (data.level === 0 || data.level === 1) {
            arr.push("admin")
          } else if (data.level === 2) {
            arr.push("user")
          } else {
            arr.push("visitor")
          }
          const accessRoutes = await store.dispatch('permission/generateRoutes', arr) //第二步
          router.options.routes = store.getters.permission_routes //第三步
          router.addRoutes(accessRoutes)
          next({...to, replace: true})

          // await store.dispatch('user/getInfo')
          // next()

        } catch (error) {
          // 删除令牌，转到登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在登录白名单中，直接跳转
      next()
    } else {
      // 其他没有访问权限的页面将被重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})
