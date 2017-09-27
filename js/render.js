define(function (require, exports, module) {
    var type = "WebGL";
    if (!PIXI.utils.isWebGLSupported()) {
        type = "canvas";
    }
    PIXI.utils.sayHello(type);

    var comp = require('./comp');

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

        
    var speedConfig = comp.attributes,
        trackNum = speedConfig.meta.num;
        trackerWidth = speedConfig.trackBar.bboxWidth,
        trackerHeight = speedConfig.trackBar.bboxHeight,
        delta = speedConfig.meta.delta,   // 每个条目的错位距离
        interval = speedConfig.meta.interval,  // 每个条目的间隔距离
        motionPathArr = speedConfig.trackBar.motionPath, // 轨迹的实际路径
        maskWidth = speedConfig.trackBar.trackWidth,  // 轨迹蒙层的宽度
        trackDelay = speedConfig.meta.deltaTime   // 轨迹蒙层的延迟时间
    
    var maskSpr;  // 蒙层

    PIXI.loader
        .add('../images/paint.png')
        .load(function () {
        
        var i = 1;
        for (var i = 0; i < trackNum; i++) {
            oneTrack(i, trackNum);
        }

        function oneTrack(i, len) {
            // trackBar
            var trackBarSpr = new Sprite(resources['../images/paint.png'].texture)
            stage.addChild(trackBarSpr);
            trackBarSpr.width = trackerWidth;
            trackBarSpr.height = trackerHeight;
            if (delta > 0) {
                trackBarSpr.x = (i + 1 - len) * delta;
            } else {
                trackBarSpr.x = i * delta;
            }
            trackBarSpr.y = i * interval;
            // mask
            var maskCanvas = createMaskCanvas(trackBarSpr, maskWidth, motionPathArr);
            maskSpr = new Sprite(Texture.fromCanvas(maskCanvas));
            trackBarSpr.mask = maskSpr;
            maskSpr.maskCanvas = maskCanvas;
            maskSpr.x = trackBarSpr.x;
            maskSpr.y = trackBarSpr.y;
            maskSpr.startPointer = 0;  // 蒙层非透明部分
            maskSpr.endPointer = 0;
            updateMask(maskSpr);  // 初始更新蒙层
            new TWEEN.Tween(maskSpr)
            .to({
                startPointer: 1
            }, 1950)
            .delay(i * trackDelay)
            .easing( TWEEN.Easing.Cubic.Out )
            .onUpdate(function (obj) {
                updateMask(obj);
            })
            .start();

            stage.addChild(maskSpr);
        }
    })
    
    
    renderer.render(stage);

    document.body.querySelector('.compwrapper').appendChild(renderer.view);

    function createMaskCanvas(targetSpr, maskWidth, motionPathArr) {
        var canvas = document.createElement('canvas');
        canvas.width = targetSpr.width;
        canvas.height = targetSpr.height;
        var ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#ff0000';
        ctx.beginPath();
        ctx.lineWidth = maskWidth;
        for (var i = 0; i < motionPathArr.length; i++) {
            var method = motionPathArr[i][0],
                args = motionPathArr[i][1];
            ctx[method].apply(ctx, args);
        }
        ctx.stroke();
        return canvas;
    }

    function updateMask(maskSpr) {
        var canvas = maskSpr.maskCanvas,
            ctx = canvas.getContext('2d');
            start = maskSpr.startPointer,
            end = maskSpr.endPointer;
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        var gradient = ctx.createLinearGradient(0, maskSpr.height, maskSpr.width, 0);
            gradient.addColorStop(end, 'rgba(255,255,255,0)');
            gradient.addColorStop(end, 'rgba(255,255,255,1)');
            gradient.addColorStop(start, 'rgba(255,255,255,1)');
            gradient.addColorStop(start, 'rgba(255,255,255,0)');
        ctx.strokeStyle = gradient;
        ctx.stroke();
        maskSpr.texture.update();
    }

    // 立即执行渲染
    (function animate() {
        TWEEN.update();
        renderer.render(stage);
        requestAnimationFrame(animate);
    })();
});