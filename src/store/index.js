import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userid: 0,
        nickname: "",
        total: 1, // 帖子列表的总页数
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
