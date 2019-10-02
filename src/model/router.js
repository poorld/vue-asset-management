import Vue from 'vue'
import VueRouter from 'vue-router'
import storage from './storage'

//component
//资产入库
import AssetsStorage from '../component/AssetsStorage'
//资产借用
import AssetsBorrow from '../component/AssetsBorrow.vue'
//资产归还
import AssetsReturn from '../component/AssetsReturn.vue'
//资产报废
import AssetsRetirement from '../component/AssetsRetirement.vue'
//存放地点
import Location from '../component/Location.vue'
//供应商
import Supplier from '../component/Supplier.vue'
//部门
import Department from '../component/Department.vue'
//个人信息
import Information from '../component/Information.vue'
//资产类别管理
import AssetsClassManager from '../component/AssetsClassManager.vue'
//资产类别报废
import AssetsClassRetirement from '../component/AssetsClassRetirement.vue'
//品牌
import Brand from '../component/Brand.vue'
//登录
import Login from '../component/Login.vue'

Vue.use(VueRouter)

const routes = [
    {path: '/assetsStorage', component: AssetsStorage},//资产入库
    {path: '/assetsBorrow',component: AssetsBorrow},
    {path: '/assetsReturn',component: AssetsReturn},
    {path: '/assetsRetirement',component: AssetsRetirement},
    {path: '/place', component: Location},
    {path: '/supplier', component: Supplier},
    {path: '/department', component: Department},
    {path: '/information', component: Information},
    {path: '/assetsClassManager',component: AssetsClassManager},
    {path: '/assetsClassRetirement',component: AssetsClassRetirement},
    {path: '/brand',component: Brand},
    {path: '/login', component: Login},
    //默认值
    {path: '/',redirect: '/information'}
  ]
  
  const router = new VueRouter({
    mode: 'history',
    routes
  })



router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/login')){
    storage.removeToken()
    next()
  }else {
    let token = storage.getToken()
    if (!token){
      next({path: '/login'})
    }else {
      next()
    }
  }
})

export default router