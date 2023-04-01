import Vue from 'vue'
import VueRouter from 'vue-router'
import Users from '../components/user/User.vue'
import Rights from '../components/power/Rights.vue'
import Login from '../components/Login.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/GoodList.vue'
import AddGoods from '../components/goods/AddGoods.vue'
import Order from '../components/order/Order.vue'
import Report from '../components/report/Report.vue'

// 导入进度条
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component:Login,
    meta:{
      Pagetitle:'登录'
    }
  },
  {
    path: '/home',
    component: () => import('../components/Home.vue'),
    redirect:'/welcome',
    meta:{
      title:'首页'
    },
    children: [
      {
        path: '/welcome',
        component: () => import('../views/Welcome.vue'),
      },
      {
        path:'/users',
        component:Users,
        meta:{
          title:'用户管理 > 用户列表',
          Pagetitle:'用户管理'
          
        }
      },
      {
        path:'/rights',
        component:Rights,
        meta:{
          title:'权限管理 > 权限列表',
          Pagetitle:'权限管理'
        }
      },
      {
        path:'/roles',
        component:Roles,
        meta:{
          title:'权限管理  >  角色列表',
          Pagetitle:'权限管理'
        }
      },
      {
        path:'/categories',
        component:Cate,
        meta:{
          title:'商品管理  >  商品分类',
          Pagetitle:'商品分类'
        }
      },
      {
        path:'/params',
        component:Params,
        meta:{
          title:'商品管理  >  分类参数',
          Pagetitle:'分类参数'
        }
      },
      {
        path:'/goods',
        component:GoodsList,
        meta:{
          title:'商品管理  >  商品列表',
          Pagetitle:'商品列表'
        }
      },
      {
        path:'/goods/add',
        component:AddGoods,
        meta:{
          title:'商品管理  >  商品列表 > 添加商品',
          Pagetitle:'添加商品'
        }
      },
      {
        path:'/orders',
        component:Order,
        meta:{
          title:'订单管理  >  订单列表',
          Pagetitle:'订单列表'
        }
      },
      {
        path:'/reports',
        component:Report,
        meta:{
          title:'数据统计  >  数据报表',
          Pagetitle:'数据报表'
        }
      },
  ]
  },

]


// 防止重复跳转当前页面
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}





const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  // 去登录页直接放行
  if (to.path === '/login') return next()
  // 获取token值
  const tokenStr = sessionStorage.getItem('token');
  // 没有token，强制跳回login页
  if (!tokenStr) return next('/login')
  // 有token
  next()
})
router.afterEach((to,from ,next) => {
  document.title = to.meta.Pagetitle || '后台管理系统'
  NProgress.done()
})

export default router