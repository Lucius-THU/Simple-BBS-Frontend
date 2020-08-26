<template>
    <div class="create">
        <div class="container">
            <form>
                <div class="row">
                    <label>标题</label>
                    <input v-model="title">
                    <a href="https://www.markdown.xyz/basic-syntax/" target="_blank">Markdown 基本语法</a>
                    <Emotion @emo="add"></Emotion>
                    <button type="button" @click.prevent="preview">预览</button>
                    <button type="submit" @click.prevent="submit">发布</button>
                </div>
                <div v-if="!show" v-html="display(content)"></div>
                <textarea v-show="show" id="area" v-model="content" ref="contentArea"></textarea>
            </form>
        </div>
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
    name: 'Create',
    components: {
        Emotion
    },
    data(){
        return {
            title: "",
            content: "",
            show: true
        }
    },
    mounted(){
        if(this.$route.path !== '/create'){
            this.axios.get('/api/v1/post/' + this.$route.params.postid).then(response => {
                this.title = response.data.title
                this.content = response.data.content
            })
        }
    },
    methods: {
        preview(){
            this.show = !this.show
        },
        submit(){
            if(this.$route.path === '/create'){
                this.axios.post('/api/v1/post', {
                    title: this.title,
                    content: this.content
                }).then(response => {
                    this.$router.replace('/post/' + response.data.postId)
                }).catch(error => {
                    if(error.response.status === 401) this.$router.push('/login')
                })
            } else {
                this.axios.put('/api/v1/post/' + this.$route.params.postid, {
                    title: this.title,
                    content: this.content
                }).then(() => {
                    this.$router.replace('/post/' + this.$route.params.postid)
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
.container {
    text-align: left;
    padding-bottom: 20px;
}

form {
    width: 90%;
    margin: 10px auto;
    font-family: Helvetica, 'Microsoft Yahei', sans-serif;
}

.row {
    margin: 15px auto;
    padding: 15px 5px 10px 5px;
    display: flex;
}

label {
    color: #898989;
    padding-right: 16px;
    margin: auto 0;
}

.row > input {
    flex-grow: 1;
    border: 0;
    outline: none;
    border-bottom: 1px solid rgba(130, 63, 156, 0.829);
    font-size: 16px;
}

.row > button {
    margin-left: 15px;
    padding: 4px 26px;
    outline: none;
    border: 1px solid black;
    border-radius: 3px;
    cursor: pointer;
}

.row > button:hover {
    background-color: white;
}

.row > button:active {
    background-color: rgb(239, 239, 239);
}

textarea {
    width: 100%;
    outline: none;
    height: calc(100vh - 295px);
    border-radius: 5px;
    font-size: 14px;
    font-family: Helvetica, 'Microsoft Yahei', sans-serif;
    resize: none;
    padding: 5px;
}

.row a {
    margin: auto 15px;
}
</style>
