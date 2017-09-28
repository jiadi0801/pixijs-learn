define(function (require, exports, module) {
    var type = "WebGL";
    if (!PIXI.utils.isWebGLSupported()) {
        type = "canvas";
    }
    PIXI.utils.sayHello(type);

    var comp = require('./comp');
    var csHelper = require('./interpolatorHelper');

    var Sprite = PIXI.Sprite,
        resources = PIXI.loader.resources,
        Container = PIXI.Container,
        Graphics = PIXI.Graphics,
        Rope = PIXI.mesh.Rope,
        Point = PIXI.Point,
        Text = PIXI.Text,
        Texture = PIXI.Texture,
        BaseTexture = PIXI.BaseTexture;

    var renderWidth = comp.surface.width,
        renderHeight = comp.surface.height,
        renderer = PIXI.autoDetectRenderer(renderWidth, renderHeight, {antialias: false, transparent: false, resolution: 1}),
        stage = new PIXI.Container();

    // 配置属性和工具   
    var speedConfig = comp.attributes,
        trackNum = speedConfig.meta.num;
        trackerWidth = speedConfig.trackBar.bboxWidth,
        trackerHeight = speedConfig.trackBar.bboxHeight,
        paddingTop = speedConfig.meta.paddingTop,
        delta = speedConfig.meta.delta,   // 每个轨迹条的错位距离
        interval = speedConfig.meta.interval,  // 每个轨迹条的间隔距离
        motionPathArr = speedConfig.trackBar.motionPath, // 轨迹的实际路径
        points = Array.prototype.concat.apply([], motionPathArr), // 扁平的轨迹骨架坐标
        cPoints = csHelper.quantX(csHelper.genCardinalSplinePoints(points)), 
        csInterpolator = csHelper.createCSInterpolator(cPoints), 
        maskWidth = speedConfig.trackBar.trackWidth,  // 轨迹蒙层的宽度
        trackDelay = speedConfig.meta.deltaTime;   // 轨迹蒙层的延迟时间

    PIXI.loader
        .add('../images/paint.png')
        .load(function () {
        
        var i = 1;
        for (var i = 0; i < trackNum; i++) {
            oneTrack(i, trackNum);
        }

        function oneTrack(i, len) {
            var trackObj = {};
            trackObj.startPointer = 0;
            trackObj.endPointer = 0;
            // trackBar
            var trackBarSpr = new Sprite(resources['../images/paint.png'].texture)
            trackObj.trackBarSpr = trackBarSpr;
            stage.addChild(trackBarSpr);
            trackBarSpr.width = trackerWidth;
            trackBarSpr.height = trackerHeight;
            if (delta > 0) {
                trackBarSpr.x = (i + 1 - len) * delta;
            } else {
                trackBarSpr.x = i * delta;
            }
            trackBarSpr.y = i * interval + paddingTop;
            // mask
            var maskCanvas = createRopeCanvas(trackBarSpr.width, trackBarSpr.height, maskWidth);
            var maskSpr = new Sprite(Texture.fromCanvas(maskCanvas));
            trackObj.maskSpr = maskSpr;
            stage.addChild(maskSpr);
            trackBarSpr.mask = maskSpr;
            maskSpr.maskCanvas = maskCanvas;
            maskSpr.x = trackBarSpr.x;
            maskSpr.y = trackBarSpr.y;
            maskSpr.startPointer = 0;  // 蒙层非透明部分
            maskSpr.endPointer = 0;
            updateMask(maskSpr, trackObj);  // 初始更新蒙层
            
            // trackHead
            
            // rank 
            var rankSpr = new PIXI.Text('第' + i + '名 ' + speedConfig.meta.tmpdata[i], {fontFamily : 'Yahei', fontSize: 16, fill : 0xfad129, align : 'center'});
            trackObj.rankSpr = rankSpr;
            // rankSpr.width = speedConfig.rank.width;
            // rankSpr.height = speedConfig.rank.height;
            console.log(trackBarSpr.x, trackBarSpr.y)
            rankSpr.x = trackBarSpr.x + speedConfig.rank.offset[0];
            rankSpr.y = trackBarSpr.y + speedConfig.rank.offset[1];
            rankSpr.originX = rankSpr.x;
            rankSpr.originY = rankSpr.y;
            stage.addChild(rankSpr);
            rankSpr.visible = false;

            // TODO 将这个Tween放到外层，然后在onUpdate里遍历所有对象，这样才能同步
            new TWEEN.Tween(trackObj)
            .to({
                endPointer: 1
            }, 3000)
            .delay(i * trackDelay)
            .easing( TWEEN.Easing.Bounce.Out )
            .onUpdate(function (obj) {
                updateMask(obj.maskSpr, obj);
                updateRank(obj.rankSpr, obj);
            })
            .start();
        }
    })
    
    
    renderer.render(stage);

    document.body.querySelector('.compwrapper').appendChild(renderer.view);

    function createRopeCanvas(width, height, maskWidth) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = maskWidth;
        ctx.globalCompositeOperation = 'copy';
        return canvas;
    }

    function updateMask(maskSpr, trackObj) {
        var canvas = maskSpr.maskCanvas,
            ctx = canvas.getContext('2d');
            start = csInterpolator(trackObj.startPointer),
            end = csInterpolator(trackObj.endPointer);
        ctx.beginPath();
        var renderPoints = cPoints.slice(start * 2, end * 2 + 2);
        ctx.moveTo(renderPoints[0], renderPoints[1]);
        for (var i = 2; i < renderPoints.length; i += 2) {
            ctx.lineTo(renderPoints[i], renderPoints[i + 1])
        }
        ctx.stroke();
        maskSpr.texture.update();
    }

    function updateRank(rankSpr, trackObj) {
        rankSpr.visible = true;
        // todo 多次计算，可以提取一下
        var start = csInterpolator(trackObj.startPointer),
            end = csInterpolator(trackObj.endPointer);
            renderPoints = cPoints.slice(start * 2, end * 2 + 2);
        
        var endPoint = [renderPoints[renderPoints.length - 2], renderPoints[renderPoints.length - 1]];
        rankSpr.x = rankSpr.originX + endPoint[0];
        rankSpr.y = rankSpr.originY + endPoint[1];

    }

    // 立即执行渲染
    (function animate() {
        TWEEN.update();
        renderer.render(stage);
        requestAnimationFrame(animate);
    })();
});