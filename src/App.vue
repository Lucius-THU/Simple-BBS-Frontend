<template>
    <div id="app">
        <!--<nav>
            <ul>
                <li><router-link to="/">首页</router-link></li>
                <li><router-link to="/about">关于</router-link></li>
                <li id="login"><router-link to="/login">登录</router-link></li>
            </ul>
        </nav>-->
        <router-view/>
        <footer>
            Copyright &copy; 2020 <a href="mailto:souzou@foxmail.com">Lucius</a> All Rights Reserved.
        </footer>
    </div>
</template>

<style>
html, body {
    margin: 0;
    height: 100%;
}

body {
    background: url(./assets/background.jpg) no-repeat center / cover;
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

nav {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #f3f3f3;
    border-bottom: 1px solid #e7e7e7;
    opacity: 0.5;
}

nav > ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
}

nav > ul > li {
    float: left;
}

nav > ul > li > a {
    display: block;
    color: #666;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
}

li a:hover {
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

.home, .about, .login{
    flex-grow: 1;
    margin-top: 50px;
}
</style>
