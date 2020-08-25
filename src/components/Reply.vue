<template>
    <div class="reply">
        <form>
            <div class="row">
                <a href="https://www.markdown.xyz/basic-syntax/" target="_blank">Markdown 基本语法</a>
                <button type="submit" @click.prevent="submit">发布</button>
                <button type="button" @click.prevent="preview">预览</button>
            </div>
            <div v-show="!show" v-html="display(content)"></div>
            <textarea v-show="show" id="area" v-model="content"></textarea>
        </form>
    </div>
</template>

<script>
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
            return '<div class="setSize">' + marked(content) + '</div>'
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
