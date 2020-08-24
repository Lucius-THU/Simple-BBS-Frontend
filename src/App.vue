<template>
    <div id="app">
        <!--<nav>
            <ul>
                <li><router-link to="/">首页</router-link></li>
                <li><router-link to="/about">关于</router-link></li>
                <li id="login"><router-link to="/login">登录</router-link></li>
            </ul>
        </nav>-->
        <router-view v-if="isRouterAlive"/>
        <Tool v-if="$route.path !== '/login'"></Tool>
        <footer>
            Copyright &copy; 2020 <a href="mailto:souzou@foxmail.com">Lucius</a> All Rights Reserved.
        </footer>
    </div>
</template>

<script>
import Tool from '@/components/Tool.vue'

export default {
    name: 'App',
    components: {
        Tool
    },
    data(){
        return{
            isRouterAlive: true
        }
    },
    provide(){
        return{
            reload:this.reload
        }
    },
    methods: {
        reload (){
            this.isRouterAlive = false
            this.$nextTick(function(){
                this.isRouterAlive = true
            })
        }
    }
}
</script>

<style>
html, body {
    margin: 0;
    height: 100%;
}

body {
    background: url(./assets/background.jpg) no-repeat fixed center / cover;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    display: flex;
    flex-direction: column;
    min-height: 100%;
}

.container {
    position: relative;
    width: 60%;
    border-radius: 20px;
    background-color: white;
    margin: 60px auto;
}

li > a:hover {
    background-color: #ddd;
}

footer {
    font-family: "Microsoft Yahei", sans-serif;
    font-size: 12px;
    color: white;
}

footer > a {
    margin: auto 10px;
    text-decoration: none;
    color: white;
}

#post-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

#post-list > li {
    border-bottom: 1px solid purple;
    font-family: Verdana, Geneva, Tahoma, "Microsoft Yahei", sans-serif;
    width: 90%;
    margin: 10px auto;
    padding: 5px 10px 15px 10px;
    text-align: left;
    transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    position: relative;
}

#post-list > li:hover {
    transform: translateX(10px);
}

#post-list > li:last-child {
    border: none;
    padding-bottom: 25px;
}

.info > li {
    font-size: 12px;
    float: left;
    padding-right: 28px;
}

.info > li:first-child {
    margin-left: -20px;
}

.content {
    margin: 20px auto;
}

.circle {
    margin: 0;
    padding: 0;
    position: fixed;
    border-radius: 50%;
    cursor: pointer;
    line-height: 100%;
    text-align: center;
    color: white;
    user-select: none;
    font-family: "Microsoft Yahei", sans-serif;
}

.home, .about, .login, .post, .create{
    flex-grow: 1;
    margin-top: 40px;
}
</style>
