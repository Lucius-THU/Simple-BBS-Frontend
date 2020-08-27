<template>
    <div class="reply">
        <form>
            <div class="row">
                <a href="https://www.markdown.xyz/basic-syntax/" target="_blank">Markdown 基本语法</a>
                <button type="submit" @click.prevent="submit">发布</button>
                <button type="button" @click.prevent="preview">{{ show ? '预览' : '编辑'}}</button>
                <Emotion @emo="add"></Emotion>

                <!-- 帖子为空时报错 -->
                <p v-if="blank" class="error">好像什么都没有写的样子！</p>
            </div>
            <div v-show="!show" v-html="display(content)"></div>
            <textarea v-show="show" id="area" v-model="content" ref="contentArea"></textarea>
        </form>
    </div>
</template>

<script>
import Emotion from '@/components/Emotion.vue'
import analyzeEmotion from '@/components/public.js'

export default {
    name: 'Reply',
    props: ['preContent', 'postid','settedReplyId', 'isEdit'],
    components: {
        Emotion
    },
    data(){
        return {
            content: this.preContent,
            show: true,
            blank: false
        }
    },
    methods: {
        preview(){ // 预览
            this.show = !this.show
        },
        submit(){ // 提交回复
            if(this.content === undefined || this.content === ''){
                this.blank = true
            } else if(!this.isEdit){ // 编辑
                this.axios.post('/api/v1/post/' + this.postid + '/reply', {
                    content: this.content,
                    replyId: this.settedReplyId
                }).then(() => {
                    this.$emit('reload');
                }).catch(error => {
                    if(error.response.status === 401) this.$router.push('/login')
                })
            } else { // 新回复
                this.axios.put('/api/v1/post/' + this.postid + '/reply/' + this.settedReplyId, {
                    content: this.content
                }).then(() => {
                    this.$emit('reload');
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

.error {
    font-family: Verdana, Geneva, Tahoma, "Microsoft Yahei", sans-serif;
    font-size: 16px;
    color: red;
    margin: auto 5px;
    text-align: center;
    animation: textAnimation 0.5s linear;
    float: right;
    padding: 0;
}
</style>
