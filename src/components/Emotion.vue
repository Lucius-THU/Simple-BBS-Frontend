<template>
    <div class="emotion">
        <span>表情</span>
        <ul>
            <li v-for="(item, index) in list" :key="index" @click="put(item)">
                <img :src="require('../assets/emotion/' + index + '.png')" :title="item">
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'Emotion',
    data(){
        return {
            list: [
                '呵呵', '哈哈', '吐舌', '啊', '酷', '怒', '开心', '汗', '泪', '黑线',
                '鄙视', '不高兴', '真棒', '钱', '疑问', '阴险', '吐', '咦', '委屈', '花心',
                '呼', '笑眼', '冷', '太开心', '滑稽', '勉强', '狂汗', '乖', '睡觉', '惊哭',
                '生气', '惊讶', '喷', '爱心', '心碎', '玫瑰', '礼物', '彩虹', '星星月亮', '太阳',
                '钱币', '灯泡', '茶杯', '蛋糕', '音乐', '爱你', '胜利', '大拇指', '弱', '好的'
            ]
        }
    },
    methods: {
        put(item){
            this.$emit('emo', item)
        }
    }
}
</script>

<style scoped>
.emotion {
    margin-left: 15px;
    padding: 4px 26px;
    outline: none;
    border: 1px solid black;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
    position: relative;
    background-color: rgb(239, 239, 239);
}

.emotion:hover {
    background-color: white;
}

.emotion:hover > ul {
    display: block;
}

ul {
    display: none;
    position: absolute;
    list-style-type: none;
    width: 400px;
    top: 105%;
    left: 0%;
    background-color: white;
    margin: 0;
    padding: 0;
}

ul > li {
    float:left;
    border: 1px solid gray;
}

img {
    padding: 4px;
}
</style>
