import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import About from '../views/About.vue'
import Post from '../views/Post.vue'
import Create from '../views/Create.vue'

Vue.use(VueRouter)
const routes = [{
        path: '/page=:page(\\d+)&size=:size(\\d+)',
        name: 'Page',
        component: Home
    },
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/user/:userid(\\d+)/page=:page(\\d+)&size=:size(\\d+)',
        name: 'UserPosts',
        component: Home
    },
    {
        path: '/post/:postid(\\d+)',
        name: 'Post',
        component: Post
    },
    {
        path: '/about',
        name: 'About',
        component: About
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/create',
        name: 'Create',
        component: Create
    },
    {
        path: '/post/:postid(\\d+)/edit',
        name: 'Edit',
        component: Create
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
