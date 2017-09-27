define(function (require, exports, module) {
    module.exports = {
        "type": "image",
        "compId": 'w12122',
        "componentName":"sssssui",
        "surface": {
            "x": 0,
            "y": 50,
            "width": 320,
            "height": 360,
            "rotate":0,
            "borderSize": 1,
            "borderColor": "black",
            "fill": "transparent"
        },
        attributes: {
            meta: {
                num: 10, // 轨迹条个数
                interval: 50, // 轨迹间隔
                delta: -10,  // 轨迹错位像素
            },
            trackBar: {
                fillType: 'img', // img | 另外独立组件gradient
                fill: ['uba/jfs/t10015/212/204464929/7319/16192d5c/59c8c2cbN1af8c016.png'], 
                motionPath: [['moveTo', [0, 28]], ['lineTo', [70, 14]], ['lineTo', [147, 7]]],  // 运动轨迹
                bboxWidth: 577 * (320 / 1250),   // 图片缩放像素
                bboxHeight: 134 * (320 / 1250),
                trackWidth: 70 * (320 / 1250) // 实际轨迹条最大处宽度，非bbox宽度
            },
            trackHead: {
                fillType: 'img',
                width: 100,
                height: 100,
                offset: [], // 相对trackBar顶部偏移
                motionPath: 'bar',
                // motionPath: [],  自定义运动轨迹， 另外独立组件
                fretting: 'rotatecenter', // 内置若干微动效果，比如自旋转，左右晃动
            },
            trackHeadParticle: {  // 粒子随头部旋转而旋转，随头部运动而运动
                textureSpr: 'img',  // 粒子素材类型，不同类型粒子配置项不一样
                totalSpr: 20, // 粒子个数
                startPosition: 'round',   // 粒子产生位置，包括trackHead四周，两侧，单点，上下左右单侧
                offset: [], // 粒子产生位置偏移
                rotRange: [], // 粒子自旋转范围， 默认围绕中心点
                scaleRange: [], // 粒子伸缩范围
                durRange: [], // 粒子持续时间
                fadeOutDur: 100, // 消失时间，单位微秒
                trackFn: 'gravity',  // 粒子轨迹函数， 根据不同轨迹函数（重力，阻尼随机，零重力窄角度面发散），扩展的参数不一样
                trackFnConfig: {},
                asyncTime: 0,  // 各粒子生成间隔， 为0时为同时生成，可产生特别的效果
            },
            rank: {
                width: 50,
                height: 50,
                offset: [],
                imgList: [], // 1-i名的排名图片
                animation: '',  // 内置几种，配置再加要爆炸
            },
            logo: {
                width: 140,
                height: 100,
                offset: [],
                imgList: [],
                animation: '',  
            },
            logoText: {
                width: 360,
                height: 100,
                textStyle: {},
                offset: [],
                textList: []
            },
            "openSelfShare": false,
            "shareSlogan": "",
            "shareThumbnailUrl": "",
            "gravityLock": "notlock"
        },
    }
});