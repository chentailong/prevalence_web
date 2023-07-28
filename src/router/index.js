import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'


export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'el-icon-s-home'}
    }]
  },
]

export const asyncRoutes = [
  {
    path: '/shop',
    component: Layout,
    redirect: '/shop/shopping',
    name: 'Shop',
    meta: {title: '物资购买', icon: 'el-icon-s-goods', roles: ['admin','user']},
    children: [
      {
        path: 'shopping',
        name: 'Shopping',
        component: () => import('@/views/shopping/index'),
        meta: {title: '商品清单', icon: 'el-icon-shopping-bag-2',roles: ['admin','user']}
      },
      {
        path: 'shoppingCart',
        name: 'ShoppingCart',
        component: () => import('@/views/shopping/cart'),
        meta: {title: '购物车', icon: 'el-icon-shopping-cart-2',roles: ['admin','user']}
      },
      {
        path: 'particulars',
        name: 'Particulars',
        component: () => import('@/views/shopping/particulars'),
        meta: {title: '购物清单', icon: 'el-icon-goods',roles: ['admin','user']},
        hidden: true
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/shopping/order'),
        meta: {title: '订单列表', icon: 'el-icon-s-operation',roles: ['admin','user']}
      },
      {
        path: 'userOrderDetail',
        name: 'UserOrderDetail',
        component: () => import('@/views/shopping/orderDetail'),
        meta: {title: '订单详情', icon: 'el-icon-goods',roles: ['admin','user']},
        hidden: true
      },
      {
        path: 'address',
        name: 'Address',
        component: () => import('@/views/shopping/addressBook'),
        meta: {title: '地址管理', icon: 'el-icon-notebook-2',roles: ['admin','user']}
      },
    ],
  },

  {
    path: '/resident',
    component: Layout,
    redirect: '/resident/user',
    name: 'Resident',
    meta: {
      title: '住户模块',
      icon: 'el-icon-user-solid',
      roles: ['admin','user']
    },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: {
          title: '住户管理',
          icon: 'el-icon-user',
          roles: ['admin']
        }
      },
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/user/admin'),
        meta: {
          title: '管理员信息',
          icon: 'el-icon-user',
          roles: ['admin']
        }
      },
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/user/list'),
        meta: {
          title: '住户信息编辑',
          icon: 'el-icon-user',
          roles: ['admin','user']
        },
      }
    ]
  },




  {
    path: '/access',
    component: Layout,
    redirect: '/access/visitor',
    name: 'Access',
    meta: {title: '出入模块', icon: 'el-icon-s-promotion', roles: ['admin']},
    children: [
      {
        path: 'visitor',
        name: 'Visitor',
        component: () => import('@/views/visitor/index'),
        meta: {title: '访客管理', icon: 'el-icon-tickets', roles: ['admin']}
      },
      {
        path: 'goHone',
        name: 'GoHone',
        component: () => import('@/views/goHome/index'),
        meta: {title: '返乡管理', icon: 'el-icon-house', roles: ['admin']}
      }
    ]
  },

  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/goods',
    name: 'goods',
    meta: {title: '物资模块', icon: 'el-icon-s-goods', roles: ['admin']},
    children: [
      {
        path: 'goods',
        name: 'Goods',
        component: () => import('@/views/goods/index'),
        meta: {title: '物资管理', icon: 'el-icon-goods', roles: ['admin']}
      },
      {
        path: '/goodsList',
        name: 'GoodsList',
        component: () => import('@/views/goods/list'),
        meta: {title: '添加物资', icon: 'el-icon-goods', roles: ['admin']},
        hidden: true
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/index'),
        meta: {title: '分类管理', icon: 'el-icon-s-grid', roles: ['admin']}
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/order/index'),
        meta: {title: '订单管理', icon: 'el-icon-s-order', roles: ['admin']}
      }
    ]
  },

  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/index',
    name: 'Announcement',
    meta: {title: '公告管理', icon: 'el-icon-message-solid', roles: ['admin']},
    children: [
      {
        path: 'notice',
        name: 'Notice',
        component: () => import('@/views/notice/index'),
        meta: {title: '公告信息管理', icon: 'el-icon-bell', roles: ['admin']}
      },

      {
        path: 'noticeList',
        name: 'NoticeList',
        component: () => import('@/views/notice/list'),
        meta: {title: '公告信息发布', icon: 'el-icon-s-open', roles: ['admin']}
      }
    ]
  },

  {
    path: '/checkIn',
    component: Layout,
    redirect: '/checkIn/visitorCheckIn',
    name: 'CheckIn',
    meta: {title: '信息登记模块', icon: 'el-icon-s-promotion', roles: ['admin','user','visitor']},
    children: [
      {
        path: 'visitorCheckIn',
        name: 'VisitorCheckIn',
        component: () => import('@/views/visitorCheckIn/index'),
        meta: {title: '访客出入登记', icon: 'el-icon-tickets', roles: ['admin','visitor']}
      },

      {
        path: 'goHoneCheckIn',
        name: 'GoHoneCheckIn',
        component: () => import('@/views/goHoneCheckIn/index'),
        meta: {title: '住户返乡登记', icon: 'el-icon-house', roles: ['admin','user']}
      },
      {
        path: 'details',
        name: 'Details',
        component: () => import('@/views/notice/details'),
        meta: {title: '公告详情', icon: 'el-icon-postcard', roles: ['admin','user']},
        hidden: true
      },
    ]
  },

  {path: '*', redirect: '/404', hidden: true},

]



const createRouter = () => new Router({
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由
}

export default router
