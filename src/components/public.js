import DOMPurify from 'dompurify'
import showdown from 'showdown'
import showdownHighlight from 'showdown-highlight'
import showdownKatex from 'showdown-katex'
import 'highlight.js/styles/googlecode.css'

const converter = new showdown.Converter({
    extensions: [
        showdownHighlight,
        showdownKatex({
            throwOnError: false,
            displayMode: true,
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: '$', right: '$', display: false },
              ],
          }),
    ]
})

function emotion(res){
    let word = res.replace(/\[|\]|;/g, '')
    const list = [
        '呵呵', '哈哈', '吐舌', '啊', '酷', '怒', '开心', '汗', '泪', '黑线',
        '鄙视', '不高兴', '真棒', '钱', '疑问', '阴险', '吐', '咦', '委屈', '花心',
        '呼', '笑眼', '冷', '太开心', '滑稽', '勉强', '狂汗', '乖', '睡觉', '惊哭',
        '生气', '惊讶', '喷', '爱心', '心碎', '玫瑰', '礼物', '彩虹', '星星月亮', '太阳',
        '钱币', '灯泡', '茶杯', '蛋糕', '音乐', '爱你', '胜利', '大拇指', '弱', '好的'
    ]
    let index = list.indexOf(word)
    if(index == -1){
        return res
    }
    const url = require('../assets/emotion/' + index + '.png')
    return '<img src="' + url + '">'
}


export default function analyzeEmotion(content){
    const s = converter.makeHtml(content).replace(/\[[\u4E00-\u9FA5]{1,4}\];/g, emotion)
    return DOMPurify.sanitize(s)
}