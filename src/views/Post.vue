<template>
    <div class="post">
        <div class="container">
            <h2>{{ info.title }}</h2>
            <router-link v-if="check(info.userId)" :to="'/post/' + info.id + '/edit'">编辑</router-link>
            <ul id="post-list">
                <PostItem v-for="(post, index) in displayInfo" :key="index" :post="post" :index="index" :mainId="info.id"></PostItem>
            </ul>
            <div class="more" v-if="startIndex + 10 < cnt"><span class="a" @click="more">加载更多</span></div>
        </div>
        <div class="container">
            <Reply @reload="reload" preContent="" :isEdit="false" :postid="info.id" :settedReplyId="0"></Reply>
        </div>
    </div>
</template>

<script>
import Reply from '@/components/Reply.vue'
import PostItem from '@/components/PostItem.vue'
import marked from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/googlecode.css'

marked.setOptions({
    breaks: true,
    highlight: function(code) {
        return hljs.highlightAuto(code).value;
    }
})

export default {
    name: 'Post',
    components: {
        Reply,
        PostItem
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
            map: {}
        }
    },
    created(){
        this.getContent()
    },
    methods: {
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
                if(this.cnt <= 10){
                    this.displayInfo = this.formatInfo
                } else {
                    for(let i = 0; i < 10; i++){
                        this.displayInfo.push(this.formatInfo[i])
                    }
                }
            })
        },
        check(userid){
            return userid === this.$store.state.userid
        },
        more(){
            this.startIndex += 10
            if(this.cnt <= this.startIndex + 10){
                for(let i = this.startIndex; i < this.cnt; i++){
                    this.displayInfo.push(this.formatInfo[i])
                }
            } else {
                for(let i = this.startIndex; i < this.startIndex + 10; i++){
                    this.displayInfo.push(this.formatInfo[i])
                }
            }
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
</style>
