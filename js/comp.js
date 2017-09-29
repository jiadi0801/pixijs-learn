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
            // 此区域设置均为原始像素
            meta: {
                num: 5, // 轨迹条个数
                interval: 100, // 轨迹间隔 
                delta: -20,  // 轨迹错位像素
                deltaAngle: -3.5, // 轨迹错位角度
                deltaTime: 100,  // 轨迹动画错位时间
                paddingTop: 250,    // 内容区的边距
                paddingLeft: -20,
                originWidth: 750, // psd设计文件宽度
                tmpdata: ['长虹', '康佳', '海信', '蓝鲸', '小米']
            },
            trackBar: {
                fillType: 'img', // img | 另外独立组件gradient
                fill: ['uba/jfs/t9733/162/380181925/6763/4f22c80d/59cdbf13N53c2c2c3.png'], 
                motionPath: [[0, 135],[85, 75],[170, 42],[380, 0]],  // 轨迹骨架点
                trackWidth: 30  // 实际轨迹条最大处宽度，非bbox宽度
            },
            trackHead: {
                fillType: 'img',
                fill: [
                    'uba/jfs/t8413/135/2434415281/2507/ee07e9ee/59cdbf1cNc925ffc0.png'
                ],
                isAutoFill: false, // 自动填充余下的数据
                offset: [-10, 0], // 相对trackBar顶部偏移
                alongTan: false,  // 是否沿切线方向运动
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
                offset: [50, -26],
                fill: [
                    'uba/jfs/t9670/221/364227472/1468/88d49f40/59cdbf2dN272b6d73.png',
                    'uba/jfs/t8401/175/2415246228/1671/bdaf8731/59cdbf2dNadb86dc6.png',
                    'uba/jfs/t8947/294/2461268837/1632/8ff3243e/59cdbf36Ne6fcfca7.png',
                    'uba/jfs/t10831/157/311287799/1511/c3c640d2/59cdbf30Nff702519.png',
                    'uba/jfs/t8464/243/2470010844/1676/47a80afb/59cdbf2eN39431101.png',
                    'uba/jfs/t8431/149/2384178548/1687/2a672ee7/59cdbf2aN9a7a5768.png',
                    'uba/jfs/t10453/175/387758744/1611/4dc7ac5d/59cdbf30Nf93ae20c.png',
                    'uba/jfs/t8464/225/2382895183/1868/1f0ad0dd/59cdbf30Nbc99ddfa.png',
                    'uba/jfs/t9898/211/362326345/1664/cd8fe86e/59cdbf2eN8b5761ad.png',
                    'uba/jfs/t8320/184/2448852148/1784/b4e5af35/59cdbf1cN234c344a.png'
                ]
            },
            logo: {
                width: 100,
                height: 50,
                offset: [10, -10],
                fill: [
                    'uba/jfs/t9028/168/1972486316/318/b5f0a65/59ce2e8bN96a87848.png',
                    'uba/jfs/t9028/168/1972486316/318/b5f0a65/59ce2e8bN96a87848.png',
                    'uba/jfs/t9028/168/1972486316/318/b5f0a65/59ce2e8bN96a87848.png',
                    'uba/jfs/t9028/168/1972486316/318/b5f0a65/59ce2e8bN96a87848.png',
                    'uba/jfs/t9028/168/1972486316/318/b5f0a65/59ce2e8bN96a87848.png'
                ]
            },
            rankText: {
                fillType: 'text',
                fill: [
                    '京东生鲜1单品11月X日',
                    '京东生鲜2单品11月X日',
                    '京东生鲜3单品11月X日',
                    '京东生鲜4单品11月X日',
                    '京东生鲜5单品11月X日',
                    '京东生鲜6单品11月X日',
                    '京东生鲜7单品11月X日',
                    '京东生鲜8单品11月X日',
                    '京东生鲜9单品11月X日',
                    '京东生鲜10单品11月X日'
                ],
                textStyle: {
                    fontFamily: 'Microsoft YaHei, Arial, Helvetica, sans-serif',
                    fontSize: 24,
                    color: '#fff'
                },
                rotation: -4,
                offset: [120, -15]
            },
            "openSelfShare": false,
            "shareSlogan": "",
            "shareThumbnailUrl": "",
            "gravityLock": "notlock"
        },
    }
});