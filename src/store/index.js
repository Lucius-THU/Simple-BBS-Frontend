import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userid: 0,
        nickname: "",
        total: 1,
        now: 1
    },
    mutations: {
        setUserId(state, userid){
            state.userid = userid
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
