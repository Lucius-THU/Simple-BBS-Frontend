<template>
    <div class="home">
        <div class="container">
            <ul id="post-list">
                <li v-for="(post, index) in posts" :key="index">
                    <h3>{{ post.title }}</h3>
                    <p :class="{ summary: post.content.length > 1500 }">{{ post.content }}</p>
                    <div class="hide-bar" v-if="post.content.length > 1500"></div>
                    <ul class="info">
                        <li>作者：<router-link :to="'/user/' + post.userId + '/page=1&size=10'">{{ post.nickname }}</router-link></li>
                        <li>发帖时间：{{ (s => {const t = s.split(/[+T]/); return t[0] + " " + t[1] })(post.created) }}</li>
                        <li>更新时间：{{ (s => {const t = s.split(/[+T]/); return t[0] + " " + t[1] })(post.updated) }}</li>
                    </ul>
                </li>
            </ul>
        </div>
        <NextPage v-if="nextSeen" @click.native="Pageto(1)"></NextPage>
        <PrevPage v-if="prevSeen" @click.native="Pageto(-1)"></PrevPage>
    </div>
</template>

<script>
// @ is an alias to /src
import NextPage from '@/components/NextPage.vue'
import PrevPage from '@/components/PrevPage.vue'

export default {
    name: 'Home',
    components: {
        NextPage,
        PrevPage
    },
    data(){
        return {
            posts: {},
            nextSeen: false,
            prevSeen: false,
            userid: this.$route.params.userid,
            page: this.$route.params.page,
            size: this.$route.params.size
        }
    },
    beforeRouteUpdate (to, from, next) {
        this.userid = to.params.userid
        this.page = to.params.page
        this.size = to.params.size
        this.refresh()
        next()
    },
    beforeRouteLeave (to, from, next) {
        this.userid = to.params.userid
        this.page = to.params.page
        this.size = to.params.size
        this.refresh()
        next()
    },
    created(){
        this.refresh()
        if(this.$route.path === '/') this.$router.push('/page=1&size=10')
    },
    methods: {
        Pageto(t){
            if(this.$route.path.indexOf('user') === -1) this.$router.push('/page=' + (Number(this.page) + t) + '&size=' + this.size)
            else this.$router.push('/user/' + this.userid + '/page=' + (Number(this.page) + t) + '&size=' + this.size)
        },
        refresh(){
            this.axios.get('/api/v1/post', {
                params: {
                    page: this.page,
                    size: this.size,
                    userId: this.userid === undefined ? 0: this.userid
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
        }
    }
}
</script>

<style scoped>

#post-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

#post-list > li {
    border-bottom: 1px solid purple;
    font-family: Verdana, Geneva, Tahoma, "Microsoft Yahei", sans-serif;
    width: 90%;
    margin: 10px auto;
    padding: 5px 10px 15px 10px;
    text-align: left;
    transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    position: relative;
}

#post-list > li:hover {
    transform: translateX(10px);
}

#post-list > li:last-child {
    border: none;
    padding-bottom: 25px;
}

.info > li {
    font-size: 12px;
    float: left;
    padding-right: 28px;
}

.info > li:first-child {
    margin-left: -20px;
}

.summary {
    height: 350px;
    overflow: hidden;
    text-overflow: clip;
}

.hide-bar {
    position: absolute;
    width: 98%;
    height: 100px;
    bottom: 28px;
    background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 70%);
}

a {
    color: black;
}
</style>
