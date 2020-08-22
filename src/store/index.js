import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        username: "",
        nickname: "",
        total: 1
    },
    mutations: {
        setUsername(state, username){
            state.username = username
        },
        setNickname(state, nickname){
            state.nickname = nickname
        },
        setTotalPage(state, total){
            state.total = total
        }
    },
    actions: {
    },
    modules: {
    }
})
