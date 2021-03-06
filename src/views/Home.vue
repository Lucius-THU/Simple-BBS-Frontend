<template>
    <div class="home">
        <div class="container">
            <ul id="post-list">
                <li v-for="(post, index) in posts" :key="index" @click="getPost(post, $event)">
                    <h3>{{ post.title }}</h3>
                    <div class="content" :class="{ summary: post.content.length > 1000 }" v-html="display(post.content)"></div>
                    <div class="hide-bar" v-if="post.content.length > 1000"></div>
                    <ul class="info">
                        <li>作者：<router-link target="_blank" :to="'/user/' + post.userId + '/page=1&size=10'">{{ post.nickname }}</router-link></li>
                        <li>发帖时间：{{ (s => {const t = s.split(/[+T]/); return t[0] + " " + t[1] })(post.created) }}</li>
                        <li v-if="seen(post)">{{ latestTimeTag(post) }}：{{ (s => {const t = s.split(/[+T]/); return t[0] + " " + t[1] })(latestTime(post)) }}</li>
                    </ul>
                </li>
            </ul>
        </div>
        <NextPage v-if="nextSeen" @click.native="Pageto(1)"></NextPage>
        <PrevPage v-if="prevSeen" @click.native="Pageto(-1)"></PrevPage>
        <ToPage :now="page === undefined ? 1: Number(page)" :total="$store.state.total" @to="Pageto"></ToPage>
    </div>
</template>

<script>
import NextPage from '@/components/NextPage.vue'
import PrevPage from '@/components/PrevPage.vue'
import ToPage from '@/components/ToPage.vue'
import analyzeEmotion from '@/components/public.js'

export default {
    name: 'Home',
    components: {
        NextPage,
        PrevPage,
        ToPage
    },
    data(){
        return {
            posts: [],
            nextSeen: false,
            prevSeen: false,
            userid: this.$route.params.userid,
            page: this.$route.params.page,
            size: this.$route.params.size
        }
    },
    beforeRouteUpdate(to, from, next) {
        this.userid = to.params.userid
        this.page = to.params.page
        this.size = to.params.size
        this.refresh()
        next()
    },
    beforeRouteLeave(to, from, next) {
        if(to.path === '/login'){
            next()
        } else {
            this.userid = to.params.userid
            this.page = to.params.page
            this.size = to.params.size
            this.refresh()
            next()
        }
    },
    created(){
        document.title = '清软论坛'
        this.refresh()
        if(this.$route.path === '/') this.$router.push('/page=1&size=10')
    },
    methods: {
        Pageto(t){ // 跳转
            if(this.$route.path.indexOf('user') === -1) this.$router.push('/page=' + (Number(this.page) + t) + '&size=' + this.size)
            else this.$router.push('/user/' + this.userid + '/page=' + (Number(this.page) + t) + '&size=' + this.size)
        },
        refresh(){ // 载入当前页的帖子
            this.axios.get('/api/v1/post', {
                params: {
                    page: this.page,
                    size: this.size,
                    userId: this.userid === undefined ? 0: this.userid,
                    orderByReply: true
                }
            }).then(response => {
                this.$store.commit('setTotalPage', parseInt((response.data.total + response.data.size - 1) / response.data.size))
                this.posts = response.data.posts
                this.page = response.data.page
                this.size = response.data.size
                this.nextSeen = this.page < this.$store.state.total
                this.prevSeen = this.page > 1
            }).catch(error => {
                if(error.response.status === 401) this.$router.push('/login')
            })
        },
        seen(post){ // 只有当帖子有回复或被编辑过时，才显示更新时间
            return post.lastRepliedTime !== post.created
        },
        latestTime(post){ // 回复时间与主帖编辑时间，谁更晚
            return post.updated < post.lastRepliedTime ? post.lastRepliedTime: post.updated
        },
        latestTimeTag(post){ // 回复时间与主帖编辑时间，谁更晚就显示谁
            return post.updated < post.lastRepliedTime ? '最新回帖时间': '更新时间'
        },
        getPost(post, event){ // 在新标签页打开对应的帖子
            if(event.target.tagName !== 'A'){
                const newPage = this.$router.resolve('/post/' + post.id)
                window.open(newPage.href, '_blank')
            }
        },
        display(content){ // 渲染文本
            return '<div class="setSize">' + analyzeEmotion(content) + '</div>'
        }
    }
}
</script>

<style scoped>
#post-list > li {
    cursor: pointer;
}

.summary {
    height: 225px;
    overflow: hidden;
    text-overflow: clip;
}

.hide-bar {
    position: absolute;
    width: 98%;
    height: 100px;
    bottom: 60px;
    background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 70%);
}
</style>
