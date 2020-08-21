import Vue from 'vue'
import axios from 'axios'
import vueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
import store from './store'


Vue.config.productionTip = false
Vue.use(vueAxios, axios)

Vue.axios.interceptors.request.use(config => {
    if(!config.headers['Authorization']){
        config.headers['Authorization'] = (() => {
            const arr = document.cookie.split(';')
            for(let i = 0; i < arr.length; i++){
                let s = arr[i].trim();
                if (s.indexOf('jwt') === 0){
                    return s.substring(4, s.length);
                }
            }
            return "";
        })()
    }
    return config;
})

const vue = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    methods: {
        init(){
            if(this.$route.path !== '/login'){
                if(this.$store.state.jwt === ""){
                    this.$store.commit('initialJwt')
                }
                this.axios.get('/api/v1/user', {
                    params: {
                        Authorization: this.$store.state.jwt
                    }
                  }).then(response => {
                    console.log(response.data)
                }).catch(error => {
                    if(error.response.status === 401) this.checkLogin()
                })
            }
        },
        checkLogin(){
            this.$router.push('/login')
        }
    }
})

vue.init()