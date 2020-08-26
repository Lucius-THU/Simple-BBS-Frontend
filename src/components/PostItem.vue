<template>
    <li>
        <div class="content" v-html="display(post.content)"></div>
        <ul class="info">
            <li>第{{ index }}层</li>
            <li>作者：<router-link :to="'/user/' + post.userId + '/page=1&size=10'">{{ post.nickname }}</router-link></li>
            <li>发帖时间：{{ (s => {const t = s.split(/[+T]/); return t[0] + " " + t[1] })(post.created) }}</li>
            <li v-if="seen(post)">更新时间：{{ (s => {const t = s.split(/[+T]/); return t[0] + " " + t[1] })(post.updated) }}</li>
            <li v-if="check(post.userId) && index"><span class="a" @click="seenEdit = !seenEdit">{{ seenEdit ? '收起编辑': '编辑' }}</span></li>
            <li v-if="index"><span class="a" @click.prevent="seenReply = !seenReply">{{ seenReply ? '收起回复': '回复' }}</span></li>
        </ul>
        <transition name="fade"><Reply v-if="seenEdit" @reload="reload" :preContent="post.content" :postid="mainId" :settedReplyId="post.id" :isEdit="true"></Reply></transition>
        <transition name="fade"><Reply v-if="seenReply" @reload="reload" preContent="" :postid="mainId" :settedReplyId="post.id" :isEdit="false"></Reply></transition>
        <div v-if="checkReply(displayInfo)" class="sub-reply">
            <ul class="sub-ul">
                <li v-for="(post, index) in displayInfo" :key="index" class="reply-style">
                    <div class="content" v-html="display(find(post.replyId) + post.content)"></div>
                    <ul class="info">
                        <li>第{{ index + 1 }}层</li>
                        <li>作者：<router-link :to="'/user/' + post.userId + '/page=1&size=10'">{{ post.nickname }}</router-link></li>
                        <li>发帖时间：{{ (s => {const t = s.split(/[+T]/); return t[0] + " " + t[1] })(post.created) }}</li>
                        <li v-if="seen(post)">更新时间：{{ (s => {const t = s.split(/[+T]/); return t[0] + " " + t[1] })(post.updated) }}</li>
                        <li v-if="check(post.userId)"><span class="a" @click="edit(index)">{{ seenEdits[index] ? '收起编辑': '编辑' }}</span></li>
                        <li><span class="a" @click.prevent="replyit(index)">{{ seenReplys[index] ? '收起回复': '回复' }}</span></li>
                    </ul>
                    <transition name="fade"><Reply v-if="seenEdits[index]" @reload="reload" :preContent="post.content" :postid="mainId" :settedReplyId="post.id" :isEdit="true"></Reply></transition>
                    <transition name="fade"><Reply v-if="seenReplys[index]" @reload="reload" preContent="" :postid="mainId" :settedReplyId="post.id" :isEdit="false"></Reply></transition>
                </li>
            </ul>
        </div>
        <div class="more" v-if="startIndex + 10 < cnt"><span class="a" @click="more">加载更多</span></div>
    </li>
</template>

<script>
import Reply from '@/components/Reply.vue'
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
    name: 'PostItem',
    props: ['post', 'index', 'mainId'],
    inject: ['reload'],
    components: {
        Reply
    },
    data(){
        return {
            seenEdit: false,
            seenReply: false,
            displayInfo: [],
            seenEdits: [],
            seenReplys: [],
            startIndex: 0,
            cnt: 0
        }
    },
    created(){
        if(this.post.reply !== undefined){
            this.cnt = this.post.reply.length
            this.seenEdits.length = this.cnt
            this.seenEdits.fill(false)
            this.seenReplys.length = this.cnt
            this.seenReplys.fill(false)
            if(this.cnt <= 10){
                    this.displayInfo = this.post.reply
            } else {
                for(let i = 0; i < 10; i++){
                    this.displayInfo.push(this.post.reply[i])
                }
            }
        }
    },
    methods: {
        display(content){
            return '<div class="setSize">' + this.analyzeEmotion(marked(content)) + '</div>'
        },
        seen(post){
            return post.updated !== post.created
        },
        check(userid){
            return userid === this.$store.state.userid
        },
        checkReply(postReply){
            return postReply !== undefined && postReply.length > 0
        },
        edit(index){
            this.$set(this.seenEdits, index, !this.seenEdits[index])
        },
        replyit(index){
            this.$set(this.seenReplys, index, !this.seenReplys[index])
        },
        find(replyId){
            for(let i = 0, len = this.post.reply.length; i < len; i++){
                if(this.post.reply[i].id === replyId){
                    return '&gt; 回复 ' + this.post.reply[i].nickname + ' 在第 ' + (i + 1) + ' 层的帖子<br><br>'
                }
            }
            return ""
        },
        more(){
            this.startIndex += 10
            if(this.cnt <= this.startIndex + 10){
                for(let i = this.startIndex; i < this.cnt; i++){
                    this.displayInfo.push(this.post.reply[i])
                }
            } else {
                for(let i = this.startIndex; i < this.startIndex + 10; i++){
                    this.displayInfo.push(this.post.reply[i])
                }
            }
        },
        analyzeEmotion(content){
            const pattern = /\[[\u4e00-\u9fa5]+\];/g
            const pattern2 = /\[[\u4e00-\u9fa5]+\];/
            let s = content
            const matches = content.match(pattern)
            const list = [
                '呵呵', '哈哈', '吐舌', '啊', '酷', '怒', '开心', '汗', '泪', '黑线',
                '鄙视', '不高兴', '真棒', '钱', '疑问', '阴险', '吐', '咦', '委屈', '花心',
                '呼', '笑眼', '冷', '太开心', '滑稽', '勉强', '狂汗', '乖', '睡觉', '惊哭',
                '生气', '惊讶', '喷', '爱心', '心碎', '玫瑰', '礼物', '彩虹', '星星月亮', '太阳',
                '钱币', '灯泡', '茶杯', '蛋糕', '音乐', '爱你', '胜利', '大拇指', '弱', '好的'
            ]
            if(matches){
                for(let i = 0, len = matches.length; i < len; i++){
                    for(let j = 0, len2 = list.length; j < len2; j++){
                        if('[' + list[j] + '];' === matches[i]){
                            const url = require('../assets/emotion/' + j + '.png')
                            s = s.replace(pattern2, '<img src="' + url + '">')
                            break;
                        }
                    }
                }
            }
            return s
        }
    }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity .3s linear;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}

.sub-reply {
    margin-left: 30px;
    margin-bottom: 10px;
    font-size: 14px;
}

.sub-ul {
    list-style-type: none;
    font-size: 0.95em;
}

.reply-style {
    border-top: 1px solid pink;
}
</style>
