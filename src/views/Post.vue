<template>
    <div class="post">
        <div class="container">
            <h2>{{ info.title }}</h2>
            <router-link v-if="check(info.userId)" :to="'/post/' + info.id + '/edit'">编辑</router-link>
            <ul id="post-list">
                <PostItem v-for="(post, index) in displayInfo" :key="index + startIndex" :post="post" :index="index + startIndex + 1" :mainId="info.id"></PostItem>
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
            displayInfo: [],
            startIndex: 0,
            cnt: 0,
            step: 10,
            total: 1,
            now: 1,
            nextSeen: false,
            prevSeen: false,
            map: {}
        }
    },
    created(){
        this.getContent()
    },
    methods: {
        Pageto(num){
            this.now += num
            if(this.now > 1) this.prevSeen = true
            else this.prevSeen = false
            if(this.now < this.total) this.nextSeen = true
            else this.nextSeen = false
            this.startIndex += num * this.step
            this.displayInfo = []
            if(this.cnt <= this.startIndex + this.step){
                for(let i = this.startIndex; i < this.cnt; i++){
                    this.displayInfo.push(this.formatInfo[i])
                }
            } else {
                for(let i = this.startIndex; i < this.startIndex + this.step; i++){
                    this.displayInfo.push(this.formatInfo[i])
                }
            }
        },
        getContent(){
            this.axios.get('/api/v1/post/' + this.postid).then(response => {
                this.info = response.data
                this.info.reply.unshift({
                    id: this.info.id,
                    userId: this.info.userId,
                    nickname: this.info.nickname,
                    content: this.info.content,
                    created: this.info.created,
                    updated: this.info.updated
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
                this.total = parseInt((this.cnt + this.step - 1) / this.step)
                if(this.cnt <= 10){
                    this.displayInfo = this.formatInfo
                } else {
                    for(let i = 0; i < 10; i++){
                        this.displayInfo.push(this.formatInfo[i])
                    }
                    this.nextSeen = true
                }
            })
        },
        check(userid){
            return userid === this.$store.state.userid
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

.container > a:hover {
    background-color: #ddd;
}

.to-page {
    margin: 10px auto;
}
</style>
