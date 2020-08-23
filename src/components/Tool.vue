<template>
    <div class="circle tool">
        <router-link :to="'/user/' + user.id + '/page=1&size=10'">{{ lastname }}</router-link>
        <ul class="show-after-hover">
            <li id="logout" @click="logout($event)">登出</li>
            <li>发帖</li>
            <li><router-link to="/">首页</router-link></li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'Tool',
    data(){
        return {
            user: {},
            lastname: ""
        }
    },
    created(){
        this.axios.get('/api/v1/user').then(response => {
            this.user = response.data
            this.lastname = response.data.nickname[0]
        })
    },
    methods: {
        logout(event){
            if(event.target.id === 'logout'){
                this.axios.patch('/api/v1/logout').then(() => {
                    document.cookie = ""
                    this.$router.replace({path: '/login'})
                })
            }
        }
    }
}
</script>

<style scoped>
.tool {
    width: 40px;
    height: 40px;
    bottom: 1%;
    right: 1%;
    background-color: purple;
    transform: translate(-50%, -50%);
    padding-top: 9px;
    padding-bottom: 9px;
    font-size: 22px;
    box-sizing: border-box;
}

.tool:hover > ul {
    display: block;
}

ul {
    display: none;
    position: fixed;
    bottom: 100%;
    right: 1%;
    list-style: none;
    margin: 0;
    padding: 0;
    transition: display 1s cubic-bezier(0.075, 0.82, 0.165, 1);
}

ul > li {
    margin-bottom: 5px;
    width: 100px;
    height: 30px;
    line-height: 30px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 15px;
    font-size: 14px;
}

a {
    color: white;
    text-decoration: none;
}

a:hover {
    text-decoration: none;
    background-color: transparent;
}
</style>
