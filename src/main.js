import Vue from 'vue'
import axios from 'axios'
import vueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
import store from './store'


Vue.config.productionTip = false
Vue.use(vueAxios, axios)

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
