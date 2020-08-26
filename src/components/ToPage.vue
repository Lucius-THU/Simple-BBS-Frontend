<template>
    <div class="to-page">
        <span>当前在第 {{ now }} 页，共 {{ total }} 页，去 </span><input type="number" :value="now" min="1" :max="total" ref="input" @keyup.enter="to"><span> 页</span>
        <button type="submit" @click="to">跳转</button>
    </div>
</template>

<script>
export default {
    name: 'ToPage',
    props: {
        now: Number,
        total: Number
    },
    mounted(){
        if(this.now < 1 || this.now > this.total) this.to()
    },
    methods: {
        to(){
            let value = this.$refs.input.value;
            if(value > this.total) value = this.total
            if(value < 1) value = 1
            this.$emit('to', value - this.now)
        }
    }
}
</script>

<style scoped>
.to-page {
    margin: 50px auto;
    padding: 0;
    background-color: white;
    border-radius: 15px;
    width: 500px;
    height: 35px;
    line-height: 35px;
}

input {
    width: 50px;
}

button {
    margin: auto 10px;
}
</style>
