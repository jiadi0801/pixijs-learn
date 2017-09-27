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
        trackerWidth = speedConfig.trackBar.bboxWidth,
        trackerHeight = speedConfig.trackBar.bboxHeight;

    PIXI.loader
        .add('../images/paint.png')
        .load(function () {
        
        var i = 1;
        // trackBar
        var delta = speedConfig.meta.delta,   // 每个条目的错位距离
            interval = speedConfig.meta.interval,  // 每个条目的间隔距离
            motionPathArr = speedConfig.trackBar.motionPath, // 轨迹的实际路径
            maskWidth = speedConfig.trackBar.trackWidth  // 轨迹蒙层的宽度

        var trackBarSpr = new Sprite(resources['../images/paint.png'].texture)
        stage.addChild(trackBarSpr);
        trackBarSpr.width = trackerWidth;
        trackBarSpr.height = trackerHeight;
        trackBarSpr.x = i * speedConfig.meta.delta;
        trackBarSpr.y = i * speedConfig.meta.interval;
        
        var maskSpr = new Sprite(Texture.fromCanvas(createMaskCanvas(trackBarSpr, maskWidth, motionPathArr)))
        maskSpr.x = trackBarSpr.x;
        maskSpr.y = trackBarSpr.y;
        console.log(maskSpr.width, maskSpr.height)
        stage.addChild(maskSpr)

        
    })
    
    
    renderer.render(stage);

    document.body.querySelector('.compwrapper').appendChild(renderer.view);

    function createMaskCanvas(targetSpr, maskWidth, motionPathArr) {
        var canvas = document.createElement('canvas');
        canvas.width = targetSpr.width;
        canvas.height = targetSpr.height;
        var ctx = canvas.getContext('2d');
        // var gradient = ctx.createLinearGradient(600, 0, 0, 600);
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


    function render() {
        renderer.render(stage);
    }

    function animate() {
        render();
        requestAnimationFrame(animate);
    }
    animate();

});