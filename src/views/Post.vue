<template>
    <div class="post">
        <div class="container">
            <h2>{{ info.title }}</h2>
            <router-link v-if="check(info.userId)" :to="'/post/' + info.id + '/edit'">编辑</router-link>
            <ul id="post-list">
                <li v-for="(post, index) in info.reply" :key="index">
                    <div class="blockquote" v-if="post.replyId !== undefined && post.replyId !== 0" v-html="find(info.reply, post.replyId)"></div>
                    <div class="content" v-html="post.content"></div>
                    <ul class="info">
                        <li>第{{ index }}层</li>
                        <li>作者：<router-link :to="'/user/' + post.userId + '/page=1&size=10'">{{ post.nickname }}</router-link></li>
                        <li>发帖时间：{{ (s => {const t = s.split(/[+T]/); return t[0] + " " + t[1] })(post.created) }}</li>
                        <li v-if="seen(post)">更新时间：{{ (s => {const t = s.split(/[+T]/); return t[0] + " " + t[1] })(post.updated) }}</li>
                        <li v-if="check(post.userId) && index"><span class="a" @click="edit(index)">编辑</span></li>
                    </ul>
                    <transition name="fade"><Reply v-if="seenEdit[index]" :reply="undefined" @reload="reload" :preContent="post.content" :postid="info.id" :settedReplyId="post.id"></Reply></transition>
                </li>
            </ul>
        </div>
        <div class="container">
            <Reply :reply="info.reply" @reload="reload" content=""></Reply>
        </div>
    </div>
</template>

<script>
import Reply from '@/components/Reply.vue'

export default {
    name: 'Post',
    components: {
        Reply
    },
    inject: ['reload'],
    data(){
        return {
            postid: this.$route.params.postid,
            info: {},
            seenEdit: []
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
                this.seenEdit.length = this.info.reply.length
                this.seenEdit.fill(false)
            }).catch(error => {
                if(error.response.status === 401) this.$router.push('/login')
            })
        },
        seen(post){
            return post.updated !== post.created
        },
        find(replys, replyId){
            for(let i = 1, len = replys.length; i < len; i++){
                if(replys[i].id === replyId){
                    return replys[i].nickname + ' 在第 ' + i + ' 层中说：<br>' + replys[i].content
                }
            }
        },
        check(userid){
            return userid === this.$store.state.userid
        },
        edit(index){
            this.$set(this.seenEdit, index, !this.seenEdit[index])
        }
    }
}
</script>

<style scoped>
a {
    color: black;
}

h2 {
    padding-top: 20px;
}

.blockquote {
    color: #959595;
    margin-bottom: 15px;
    padding-left: 16px;
    border-left: 4px solid rgb(99, 81, 182);
    font-size: 14px;
}

.container > a {
    color: #959595;
    font-size: 12px;
    text-decoration-line: underline;
}

.container > a:hover {
    background-color: #ddd;
}

.a {
    text-decoration-line: underline;
    cursor: pointer;
}

.a:hover {
    background-color: #ddd;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .3s linear;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>
