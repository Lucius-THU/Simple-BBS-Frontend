<template>
    <div class="circle prevPage">&lt;</div>
</template>

<script>
export default {
    name: 'NextPage',
}
</script>

<style scoped>
.prevPage {
    width: 100px;
    height: 100px;
    top: 50%;
    left: 7%;
    background-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-50%);
    font-size: 88px;
}
</style>
