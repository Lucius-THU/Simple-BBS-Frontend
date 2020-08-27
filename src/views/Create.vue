<template>
    <div class="create">
        <div class="container">
            <form>
                <div class="row">
                    <label>标题</label>
                    <input v-model="title">
                    <a href="https://www.markdown.xyz/basic-syntax/" target="_blank">Markdown 基本语法</a>
                    <Emotion @emo="add"></Emotion>
                    <button type="button" @click.prevent="preview">{{ show ? '预览' : '编辑'}}</button>
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
import analyzeEmotion from '@/components/public.js'

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
        document.title = '发帖 - 清软论坛'
        if(this.$route.path !== '/create'){
            this.axios.get('/api/v1/post/' + this.$route.params.postid).then(response => {
                this.title = response.data.title
                this.content = response.data.content
            })
        }
    },
    methods: {
        preview(){ // 预览
            this.show = !this.show
        },
        submit(){ // 提交帖子
            if(this.$route.path === '/create'){ // 新帖子
                this.axios.post('/api/v1/post', {
                    title: this.title,
                    content: this.content
                }).then(response => {
                    this.$router.replace('/post/' + response.data.postId)
                }).catch(error => {
                    if(error.response.status === 401) this.$router.push('/login')
                })
            } else { // 编辑
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
        display(content){ // 渲染文本
            return '<div class="setSize">' + analyzeEmotion(content) + '</div>'
        },
        add(item){ // 将表情标签插入文本框
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
