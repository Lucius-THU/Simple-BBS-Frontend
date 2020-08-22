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

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})