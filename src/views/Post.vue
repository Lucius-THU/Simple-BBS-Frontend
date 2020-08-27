<template>
    <div class="post">
        <div class="container">
            <h2>{{ info.title }}</h2>
            <span class="a" @click="owner = !owner">{{ !owner ? '只看楼主': '取消只看楼主' }}</span>
            <router-link v-if="check(info.userId)" :to="'/post/' + info.id + '/edit'">编辑</router-link>
            <span class="a" @click="favoriteChange">{{ favorite ? '取消收藏': '收藏' }}</span>
            <ul id="post-list">
                <PostItem v-for="post in displayInfo" :key="post.index" :post="post" :index="post.index" :mainId="info.id"></PostItem>
            </ul>
            <ToPage :now="now" :total="total" @to="Pageto"></ToPage>
        </div>
        <NextPage v-if="nextSeen" @click.native="Pageto(1)"></NextPage>
        <PrevPage v-if="prevSeen" @click.native="Pageto(-1)"></PrevPage>
        <div class="container">
            <Reply @reload="reload" preContent="" :isEdit="false" :postid="info.id" :settedReplyId="0"></Reply>
        </div>
    </div>
</template>

<script>
import Reply from '@/components/Reply.vue'
import PostItem from '@/components/PostItem.vue'
import NextPage from '@/components/NextPage.vue'
import PrevPage from '@/components/PrevPage.vue'
import ToPage from '@/components/ToPage.vue'

export default {
    name: 'Post',
    components: {
        Reply,
        PostItem,
        NextPage,
        PrevPage,
        ToPage
    },
    inject: ['reload'],
    data(){
        return {
            postid: this.$route.params.postid,
            info: {},
            formatInfo: [],
            selInfo: [],
            displayInfo: [],
            startIndex: 0,
            cnt: 0,
            step: 10,
            total: 1,
            now: 1,
            nextSeen: false,
            prevSeen: false,
            map: {},
            owner: false,
            favorite: false
        }
    },
    async created(){
        await this.getContent()
        if(sessionStorage.postid !== undefined) this.Pageto(sessionStorage.postid - this.now)
    },
    watch: {
        owner(newOwner){
            if(!newOwner){
                this.selInfo = this.formatInfo
            } else {
                this.selInfo = []
                for(let i = 0; i < this.cnt; i++){
                    if(this.formatInfo[i].userId === this.info.userId) this.selInfo.push(this.formatInfo[i])
                }
            }
            this.total = parseInt((this.selInfo.length + this.step - 1) / this.step)
            this.Pageto(1 - this.now)
        }
    },
    methods: {
        Pageto(num){ // 跳转
            this.now += num
            sessionStorage.postid = this.now
            if(this.now > 1) this.prevSeen = true
            else this.prevSeen = false
            if(this.now < this.total) this.nextSeen = true
            else this.nextSeen = false
            this.startIndex += num * this.step
            this.displayInfo = []
            for(let i = this.startIndex, len = Math.min(this.selInfo.length, this.startIndex + this.step); i < len; i++){
                this.displayInfo.push(this.selInfo[i])
            }
        },
        async getContent(){ // 获取帖子详情
            await this.axios.get('/api/v1/post/' + this.postid).then(response => {
                this.info = response.data
                this.favorite = this.isfavorite()
                if(this.info.title !== '' && this.info.title !== undefined) document.title = this.info.title + ' - 清软论坛'
                this.info.reply.unshift({
                    id: this.info.id,
                    userId: this.info.userId,
                    nickname: this.info.nickname,
                    content: this.info.content,
                    created: this.info.created,
                    updated: this.info.updated,
                })
                this.formatInfo[this.cnt++] = this.info.reply[0]
                for(let i = 1, len = this.info.reply.length; i < len; i++){
                    if(this.info.reply[i].replyId){
                        this.map[this.info.reply[i].id] = this.map[this.info.reply[i].replyId]
                        if(this.formatInfo[this.map[this.info.reply[i].replyId]].reply === undefined){
                            this.formatInfo[this.map[this.info.reply[i].replyId]].reply = []
                        }
                        this.formatInfo[this.map[this.info.reply[i].replyId]].reply.push(this.info.reply[i])
                    } else {
                        this.formatInfo[this.map[this.info.reply[i].id] = this.cnt++] = this.info.reply[i]
                    }
                }
                for(let i = 0; i < this.cnt; i++) this.formatInfo[i].index = i + 1
                this.selInfo = this.formatInfo;
                this.total = parseInt((this.selInfo.length + this.step - 1) / this.step)
                if(this.selInfo.length <= this.step){
                    this.displayInfo = this.selInfo
                } else {
                    for(let i = 0; i < this.step; i++){
                        this.displayInfo.push(this.selInfo[i])
                    }
                    this.nextSeen = true
                }

                // 加入浏览记录
                const history = localStorage.history;
                if(history !== undefined && history.indexOf('[' + this.info.id + '];') !== -1){
                    localStorage.history = history.replace('[' + this.info.id + '];', '')
                }
                if(localStorage.history === undefined){
                    localStorage.history = '[' + this.info.id + '];'
                } else {
                    localStorage.history = '[' + this.info.id + '];' + localStorage.history
                }
            }).catch(error => {
                if(error.response.status === 401) this.$router.push('/login')
            })
        },
        check(userid){ // 本人发的帖子才可以编辑
            return userid === this.$store.state.userid
        },
        isfavorite(){ // 是否有收藏
            const posts = localStorage.posts;
            return posts !== undefined &&  posts.indexOf('[' + this.info.id + '];') !== -1
        },
        favoriteChange(){ // 收藏状态变更
            if(this.favorite){
                localStorage.posts = localStorage.posts.replace('[' + this.info.id + '];', '')
            } else {
                if(localStorage.posts === undefined){
                    localStorage.posts = '[' + this.info.id + '];'
                } else {
                    localStorage.posts = '[' + this.info.id + '];' + localStorage.posts
                }
            }
            this.favorite = !this.favorite
        }
    }
}
</script>

<style scoped>
h2 {
    padding-top: 20px;
}

.container > a {
    color: #959595;
    font-size: 12px;
    text-decoration-line: underline;
}

.container > span {
    color: #959595;
    font-size: 12px;
    text-decoration-line: underline;
    margin: 0 5px;
}

.container > a:hover {
    background-color: #ddd;
}

.to-page {
    margin: 10px auto;
}
</style>
