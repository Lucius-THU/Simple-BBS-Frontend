<template>
    <div class="home container">
        <ul id="post-list">
            <li v-for="(post, index) in posts" :key="index">
                <h3>{{ post.title }}</h3>
                <p :class="{ summary: post.content.length > 1500 }">{{ post.content }}</p>
                <div class="hide-bar" v-if="post.content.length > 1500"></div>
                <ul class="info">
                    <li>作者：{{ post.nickname }}</li>
                    <li>发帖时间：{{ (s => {const t = s.split(/[+T]/); return t[0] + " " + t[1] })(post.created) }}</li>
                    <li>更新时间：{{ (s => {const t = s.split(/[+T]/); return t[0] + " " + t[1] })(post.updated) }}</li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
// @ is an alias to /src

export default {
    name: 'Home',
    data(){
        return {
            posts: {}
        }
    },
    mounted(){
        this.axios.get('/api/v1/post').then(response => {
            this.posts = response.data.posts;
        })
    },
    timeparser(s){
        const t = s.split(/[+T]/)
        return t[0] + t[1]
    }
}
</script>

<style scoped>

#post-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

#post-list > li {
    border-bottom: 1px solid purple;
    font-family: Verdana, Geneva, Tahoma, "Microsoft Yahei", sans-serif;
    width: 90%;
    margin: 10px auto;
    padding: 5px 10px 15px 10px;
    text-align: left;
    transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    position: relative;
}

#post-list > li:hover {
    transform: translateX(10px);
}

#post-list > li:last-child {
    border: none;
    margin-bottom: 15px;
}

.info > li {
    font-size: 12px;
    float: left;
    padding-right: 28px;
}

.info > li:first-child {
    margin-left: -20px;
}

.summary {
    height: 350px;
    overflow: hidden;
    text-overflow: clip;
}

.hide-bar {
    position: absolute;
    width: 100%;
    height: 100px;
    bottom: 28px;
    background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 70%);
}
</style>
