import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        username: "",
        nickname: ""
    },
    mutations: {
        setUsername(state, username){
            state.username = username
        },
        setNickname(state, nickname){
            state.nickname = nickname
        }
    },
    actions: {
    },
    modules: {
    }
})
