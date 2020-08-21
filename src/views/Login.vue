<template>
    <div class="login">
        <form>
            <h2>登录</h2>
            <input placeholder="账号">
            <input type="password" placeholder="密码">
            <button type="submit">登录</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'Login'
}
</script>

<style scoped>
form {
    background-color: #fff;
    width: 350px;
    height: 500px;
    border-radius: 15px;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.92;
}
h2 {
    font-size: 30px;
    text-align: center;
    line-height: 80px;
    margin-top: 40px;
    user-select: none;
    letter-spacing: 10px;
}

input {
    width: 70%;
    height: 25px;
    margin: 15px auto;
    padding: 10px;
    border: 0;
    outline: none;
    border-bottom: 1px solid purple;
    font-family: Verdana, Tahoma, Arial;
    font-size: 16px;
}

input::placeholder{
    font-weight: bold;
    color: gray;
}

button {
    margin-top: 20px;
    width: 75%;
    height: 40px;
    line-height: 40px;
    color: #fff;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
    border-radius: 10px;
    outline: none;
    letter-spacing: 8px;
    border: 0;
    background: linear-gradient(to right, #fbc2eb, #a6c1ee, #fbc2eb);
    background-size: 200%;
}
button:hover {
    animation: btnAnimation 1.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}

@keyframes btnAnimation {
    50% {
        background-position: 200%;
    }
}
</style>
