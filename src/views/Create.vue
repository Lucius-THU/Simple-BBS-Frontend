<template>
    <div class="create">
        <div class="container">
            <form>
                <div class="row">
                    <label>标题</label>
                    <input v-model="title">
                    <button type="button" @click.prevent="preview">预览</button>
                    <button type="submit" @click.prevent="submit">发布</button>
                </div>
                <textarea id="area" v-model="content"></textarea>
            </form>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Create',
    data(){
        return {
            title: "",
            content: ""
        }
    },
    methods: {
        preview(){

        },
        submit(){
            this.axios.post('/api/v1/post', {
                    title: this.title,
                    content: this.content
                }).then(response => {
                    this.$router.replace('/post/' + response.data.postId)
                }).catch(error => {
                    if(error.response.status === 401) this.$router.push('/login')
                })
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
</style>
