import Vue from "vue";
import VueRouter from 'vue-router'
// import Login from './components/login.vue'
// import Home from './components/home.vue'
// import welcome from './components/welcome.vue'
// import users from './components/user/users.vue'
// import Rights from './components/power/rights.vue'
// import Roles from './components/power/roles.vue'
// import Cate from './components/goods/cate.vue'
// import Params from './components/goods/params.vue'
// import GoodsList from './components/goods/list.vue'
// import Add from './components/goods/Add.vue'
// import Order from './components/order/Order.vue'
// import Report from './components/report/Report.vue'


const Login = () => import(/* webpackChunkName:"login_home_welcome" */ './components/login.vue')
// import Login from './components/Login.vue'
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ './components/home.vue')
// import Home from './components/Home.vue'
const welcome = () => import(/* webpackChunkName:"login_home_welcome" */ './components/welcome.vue')
// import Welcome from './components/Welcome.vue'
const users = () => import(/* webpackChunkName:"user" */ './components/user/users.vue')
// import Users from './components/user/Users.vue'
const Rights = () => import(/* webpackChunkName:"power" */ './components/power/rights.vue')
// import Rights from './components/power/Rights.vue'
const Roles = () => import(/* webpackChunkName:"power" */ './components/power/roles.vue')
// import Roles from './components/power/Roles.vue'
const Cate = () => import(/* webpackChunkName:"goods" */ './components/goods/cate.vue')
// import Cate from './components/goods/Cate.vue'
const Params = () => import(/* webpackChunkName:"goods" */ './components/goods/params.vue')
// import Params from './components/goods/Params.vue'
const GoodsList = () => import(/* webpackChunkName:"goods" */ './components/goods/list.vue')
// import GoodList from './components/goods/List.vue'
const Add = () => import(/* webpackChunkName:"goods" */ './components/goods/Add.vue')
// import GoodAdd from './components/goods/Add.vue'
const Order = () => import(/* webpackChunkName:"order" */ './components/order/Order.vue')
// import Order from './components/order/Order.vue'
const Report = () => import(/* webpackChunkName:"report" */ './components/report/Report.vue')
// import Report from './components/report/Report.vue'
Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                {
                    path: '/welcome',
                    component: welcome
                },
                {
                    path: '/users',
                    component: users
                },
                { path: '/rights', component: Rights },
                { path: '/roles', component: Roles },
                { path: '/categories', component: Cate },
                {
                    path:'/params',component:Params
                },
                {
                    path:'/goods',component:GoodsList
                },
                {
                    path:'/goods/add',component:Add
                },
                {
                    path:'/orders',component:Order
                },
                {
                    path:'/reports',component:Report
                }
            ]
        }

    ]
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // next() 放行   next('/login')强制跳转

    if (to.path === '/login') return next()
    // 获取token  根据是否获取token来判断是否登录
    const tokenstr = window.sessionStorage.getItem('token')
    if (!tokenstr) return next('/login')
    next();
})

export default router