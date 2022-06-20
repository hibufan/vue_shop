import Vue from "vue";
import VueRouter from 'vue-router'
import Login from './components/login.vue'
import Home from './components/home.vue'
import welcome from './components/welcome.vue'
import users from './components/user/users.vue'
import Rights from './components/power/rights.vue'
import Roles from './components/power/roles.vue'
import Cate from './components/goods/cate.vue'
import Params from './components/goods/params.vue'
import GoodsList from './components/goods/List.vue'
import Add from './components/goods/Add.vue'
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