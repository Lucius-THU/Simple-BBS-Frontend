<template>
    <div class="reply">
        <form>
            <div class="row">
                <a href="https://www.markdown.xyz/basic-syntax/" target="_blank">Markdown 基本语法</a>
                <button type="submit" @click.prevent="submit">发布</button>
                <button type="button" @click.prevent="preview">预览</button>
                <Emotion @emo="add"></Emotion>
            </div>
            <div v-show="!show" v-html="display(content)"></div>
            <textarea v-show="show" id="area" v-model="content" ref="contentArea"></textarea>
        </form>
    </div>
</template>

<script>
import Emotion from '@/components/Emotion.vue'
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
    name: 'Reply',
    props: ['preContent', 'postid','settedReplyId', 'isEdit'],
    components: {
        Emotion
    },
    data(){
        return {
            content: this.preContent,
            show: true
        }
    },
    methods: {
        preview(){
            this.show = !this.show
        },
        submit(){
            if(!this.isEdit){
                this.axios.post('/api/v1/post/' + this.postid + '/reply', {
                    content: this.content,
                    replyId: this.settedReplyId
                }).then(() => {
                    this.$emit('reload');
                }).catch(error => {
                    if(error.response.status === 401) this.$router.push('/login')
                })
            } else {
                this.axios.put('/api/v1/post/' + this.postid + '/reply/' + this.settedReplyId, {
                    content: this.content
                }).then(() => {
                    this.$emit('reload');
                }).catch(error => {
                    if(error.response.status === 401) this.$router.push('/login')
                })
            }
        },
        display(content){
            return '<div class="setSize">' + this.analyzeEmotion(marked(content)) + '</div>'
        },
        add(item){
            if(!this.show) return;
            const s = '[' + item + '];'
            const myField = this.$refs.contentArea;
            if (myField.selectionStart || myField.selectionStart === 0) {
                let startPos = myField.selectionStart;
                let endPos = myField.selectionEnd;
                this.content = myField.value.substring(0, startPos) + s + myField.value.substring(endPos, myField.value.length);
                this.$nextTick(()=>{
                    myField.focus();
                    myField.setSelectionRange(startPos + s.length, startPos + s.length)
                })
            } else {
                this.content += s
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
form {
    width: 90%;
    margin: 10px auto;
    font-family: Helvetica, 'Microsoft Yahei', sans-serif;
    text-align: left;
    padding-bottom: 15px;
}

.row {
    margin: 30px auto;
    padding: 15px 5px 10px 5px;
    margin-bottom: 10px;
}

button {
    margin-left: 15px;
    padding: 4px 26px;
    outline: none;
    border: 1px solid black;
    border-radius: 3px;
    cursor: pointer;
    float: right;
}

button:hover {
    background-color: white;
}

button:active {
    background-color: rgb(239, 239, 239);
}

.emotion {
    float: right;
}

textarea {
    width: 100%;
    outline: none;
    height: 300px;
    border-radius: 5px;
    font-size: 14px;
    font-family: Helvetica, 'Microsoft Yahei', sans-serif;
    resize: none;
    padding: 5px;
}

.row a {
    margin: auto 0;
}
</style>
