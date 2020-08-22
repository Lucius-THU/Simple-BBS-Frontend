<template>
    <div class="prevPage">
        <p>&lt;</p>
    </div>
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
    margin: 0;
    padding: 0;
    position: fixed;
    border-radius: 50%;
    top: 50%;
    left: 7%;
    background-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-50%);
    cursor: pointer;
}

p {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    line-height: 100%;
    text-align: center;
    font-size: 88px;
    color: white;
    user-select: none;
    font-family: "Microsoft Yahei", sans-serif;
}
</style>
