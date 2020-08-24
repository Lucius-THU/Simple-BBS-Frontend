<template>
    <div class="reply">
        <form>
            <div class="row">
                <label v-if="reply !== undefined">回复第<input v-model="replyid">层</label>
                <button type="submit" @click.prevent="submit">发布</button>
                <button type="button" @click.prevent="preview">预览</button>
            </div>
            <textarea id="area" v-model="content"></textarea>
        </form>
    </div>
</template>

<script>
export default {
    name: 'Reply',
    props: ['reply', 'preContent', 'postid','settedReplyId'],
    data(){
        return {
            replyid: 0,
            content: this.preContent
        }
    },
    methods: {
        preview(){

        },
        submit(){
            if(this.reply !== undefined){
                this.axios.post('/api/v1/post/' + this.postid + '/reply', {
                    content: this.content,
                    replyId: this.replyid ? this.reply[this.replyid].id: 0
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
        }
    }
}
</script>

<style scoped>
form {
    width: 90%;
    margin: 10px auto;
    font-family: Helvetica, 'Microsoft Yahei', sans-serif;
}

.row {
    margin: 25px auto;
    padding: 15px 5px 10px 5px;
}

label {
    color: #898989;
    padding-right: 16px;
    margin: auto 0;
    float: left;
}

.row input {
    flex-grow: 1;
    border: 0;
    outline: none;
    border-bottom: 1px solid rgba(130, 63, 156, 0.829);
    font-size: 16px;
    width: 50px;
    text-align: center;
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
    margin-bottom: 15px;
}
</style>
