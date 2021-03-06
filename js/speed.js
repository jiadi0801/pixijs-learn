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

    // 配置属性和工具   
    var phoneLogicWidth = 320,  // 需要从viewport里读取
        speedConfig = comp.attributes,
        originWidth = speedConfig.meta.originWidth,
        trackNum = speedConfig.meta.num,
        paddingTop = speedConfig.meta.paddingTop,
        paddingLeft = speedConfig.meta.paddingLeft,
        delta = speedConfig.meta.delta,   // 每个轨迹条的错位距离
        deltaAngle = speedConfig.meta.deltaAngle, 
        interval = speedConfig.meta.interval,  // 每个轨迹条的间隔距离
        maskWidth = speedConfig.trackBar.trackWidth, // 蒙层最大宽
        motionPathArr = speedConfig.trackBar.motionPath, // 轨迹的实际路径
        points = Array.prototype.concat.apply([], motionPathArr), // 扁平的轨迹骨架坐标
        cPoints = csHelper.quantX(csHelper.genCardinalSplinePoints(points)), 
        csInterpolator = csHelper.createCSInterpolator(cPoints), 
        trackDelay = speedConfig.meta.deltaTime,   // 轨迹蒙层的延迟时间
        rankTextStyle = speedConfig.rankText.textStyle,

        // trackHeadFill = speedConfig.trackHead.fill,
        trackHeadFill = speedConfig.trackHead.fill.map(function (rawurl) {
            return 'http://img14.360buyimg.com/' + rawurl;
        }),
        rankFill = speedConfig.rank.fill.map(function (rawurl) {
            return 'http://img14.360buyimg.com/' + rawurl;
        }),
        rankTextFill = speedConfig.rankText.fill,
        logoFill = speedConfig.logo.fill.map(function (rawurl) {
            return 'http://img14.360buyimg.com/' + rawurl;
        });


    var renderWidth = originWidth,
        renderHeight = comp.surface.height * originWidth / phoneLogicWidth,
        renderer = PIXI.autoDetectRenderer(renderWidth, renderHeight, {antialias: false, transparent: false, resolution: 1}),
        stage = new PIXI.Container();

    PIXI.loader.add('../images/fresh/fresh-trackBar.png');
    for (var i = 0; i < trackHeadFill.length; i++) {
        if (!resources[trackHeadFill[i]]) {
            PIXI.loader.add(trackHeadFill[i]);
        }
    }
    for (var i = 0; i < rankFill.length; i++) {
        if (!resources[rankFill[i]]) {
            PIXI.loader.add(rankFill[i]);
        }
    }
    for (var i = 0; i < logoFill.length; i++) {
        if (!resources[logoFill[i]]) {
            PIXI.loader.add(logoFill[i]);
        }
    }


    PIXI.loader.load(function () {
        for (var i = 0; i < trackNum; i++) {
            oneTrack(i, trackNum);
        }

        function oneTrack(i, len) {
            var trackObj = {};
            trackObj.startPointer = 0;
            trackObj.endPointer = 0;

            var singleTrack = new Container();
            stage.addChild(singleTrack);
            if (delta > 0) {
                singleTrack.x = (i + 1 - len) * delta;
            } else {
                singleTrack.x = i * delta;
            }
            singleTrack.x = singleTrack.x + paddingLeft;
            singleTrack.y = i * interval + paddingTop;
            singleTrack.rotation = singleTrack.rotation + i * deltaAngle/180*Math.PI;

            // trackBar
            var trackBarSpr = new Sprite(resources['../images/fresh/fresh-trackBar.png'].texture)
            trackObj.trackBarSpr = trackBarSpr;
            singleTrack.addChild(trackBarSpr);
            
            // mask
            var maskCanvas = createRopeCanvas(trackBarSpr.width, trackBarSpr.height, maskWidth);
            var maskSpr = new Sprite(Texture.fromCanvas(maskCanvas));
            trackObj.maskSpr = maskSpr;
            singleTrack.addChild(maskSpr);
            trackBarSpr.mask = maskSpr;
            // maskSpr.visible = false;
            maskSpr.maskCanvas = maskCanvas;
            maskSpr.x = trackBarSpr.x;
            maskSpr.y = trackBarSpr.y;
            updateMask(maskSpr, trackObj);  // 初始更新蒙层
            
            // rank 
            var rankSpr;
            if (i < rankFill.length) {
                rankSpr = new Sprite(resources[rankFill[i]].texture);
            } else {
                rankSpr = new Sprite();
            }
            rankSpr.x = trackBarSpr.x + speedConfig.rank.offset[0];
            rankSpr.y = trackBarSpr.y + speedConfig.rank.offset[1];
            rankSpr.originX = rankSpr.x;
            rankSpr.originY = rankSpr.y;
            rankSpr.rotation = rankSpr.rotation - i * deltaAngle/180*Math.PI;
            singleTrack.addChild(rankSpr);
            trackObj.rankSpr = rankSpr;
            rankSpr.visible = false;

            // rankText
            var rankTextSpr, text;
            if (i < rankTextFill.length) {
                text = rankTextFill[i];
            } else {
                text = '';
            }
            rankTextSpr = new Text(text, {
                fontFamily: rankTextStyle.fontFamily,
                fill: rankTextStyle.color,
                fontSize: rankTextStyle.fontSize
            });
            rankTextSpr.x = trackBarSpr.x + speedConfig.rankText.offset[0];
            rankTextSpr.y = trackBarSpr.y + speedConfig.rankText.offset[1];
            rankTextSpr.originX = rankTextSpr.x;
            rankTextSpr.originY = rankTextSpr.y;
            rankTextSpr.rotation = rankTextSpr.rotation - i * deltaAngle/180*Math.PI + speedConfig.rankText.rotation/180*Math.PI;
            singleTrack.addChild(rankTextSpr);
            trackObj.rankTextSpr = rankTextSpr;
            rankTextSpr.visible = false;

            // logo
            var logoSpr;
            if (i < logoFill.length) {
                logoSpr = new Sprite(resources[logoFill[i]].texture);
            } else {
                logoSpr = new Sprite();
            }
            logoSpr.x = trackBarSpr.x + speedConfig.logo.offset[0];
            logoSpr.y = trackBarSpr.y + speedConfig.logo.offset[1];
            logoSpr.originX = logoSpr.x;
            logoSpr.originY = logoSpr.y;
            logoSpr.rotation = logoSpr.rotation - i * deltaAngle/180*Math.PI;
            singleTrack.addChild(logoSpr);
            trackObj.logoSpr = logoSpr;
            logoSpr.visible = false;

            // trackHead
            var trackHeadSpr;
            var index = trackHeadFill.length;
            if (i < index) {
                trackHeadSpr = new Sprite(resources[trackHeadFill[i]].texture);
            } else {
                if (speedConfig.trackHead.isAutoFill) {
                    trackHeadSpr = new Sprite(resources[trackHeadFill[index - 1]].texture);
                } else {
                    trackHeadSpr = new Sprite();
                }
            }
            trackHeadSpr.x = trackBarSpr.x + speedConfig.trackHead.offset[0]
            trackHeadSpr.y = trackBarSpr.y + speedConfig.trackHead.offset[1];
            trackHeadSpr.originX = trackHeadSpr.x;
            trackHeadSpr.originY = trackHeadSpr.y;
            trackHeadSpr.rotation = trackHeadSpr.rotation - i * deltaAngle/180*Math.PI;
            singleTrack.addChild(trackHeadSpr);
            trackObj.trackHeadSpr = trackHeadSpr;
            trackHeadSpr.visible = false;

            // TODO 将这个Tween放到外层，然后在onUpdate里遍历所有对象，这样才能同步
            new TWEEN.Tween(trackObj)
            .to({
                endPointer: 1
            }, 500)
            .delay(i * trackDelay)
            .easing( TWEEN.Easing.Quadratic.In )
            .onUpdate(function (obj) {
                updateMask(obj.maskSpr, obj);
                updateRank(obj.rankSpr, obj);
                updateTrackHead(obj.trackHeadSpr, obj);
                updateRankText(obj.rankTextSpr, obj);
                updateLogo(obj.logoSpr, obj);
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
        if (!maskSpr) return;
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

    function updateTrackHead(trackHeadSpr, trackObj) {
        if (!trackHeadSpr) return;
        trackHeadSpr.visible = true;
        var start = csInterpolator(trackObj.startPointer),
            end = csInterpolator(trackObj.endPointer);
            renderPoints = cPoints.slice(start * 2, end * 2 + 2);
        
        var endPoint = [renderPoints[renderPoints.length - 2], renderPoints[renderPoints.length - 1]];
        trackHeadSpr.x = trackHeadSpr.originX + endPoint[0];
        trackHeadSpr.y = trackHeadSpr.originY + endPoint[1];
    }

    function updateRank(rankSpr, trackObj) {
        if (!rankSpr) return;
        rankSpr.visible = true;
        var start = csInterpolator(trackObj.startPointer),
            end = csInterpolator(trackObj.endPointer);
            renderPoints = cPoints.slice(start * 2, end * 2 + 2);
        
        var endPoint = [renderPoints[renderPoints.length - 2], renderPoints[renderPoints.length - 1]];
        rankSpr.x = rankSpr.originX + endPoint[0];
        rankSpr.y = rankSpr.originY + endPoint[1];
    }
    function updateRankText(rankTextSpr, trackObj) {
        if (!rankTextSpr) return;
        rankTextSpr.visible = true;
        var start = csInterpolator(trackObj.startPointer),
            end = csInterpolator(trackObj.endPointer);
            renderPoints = cPoints.slice(start * 2, end * 2 + 2);
        
        var endPoint = [renderPoints[renderPoints.length - 2], renderPoints[renderPoints.length - 1]];
        rankTextSpr.x = rankTextSpr.originX + endPoint[0];
        rankTextSpr.y = rankTextSpr.originY + endPoint[1];
    }
    function updateLogo(logoSpr, trackObj) {
        if (!logoSpr) return;
        logoSpr.visible = true;
        var start = csInterpolator(trackObj.startPointer),
            end = csInterpolator(trackObj.endPointer);
            renderPoints = cPoints.slice(start * 2, end * 2 + 2);
        
        var endPoint = [renderPoints[renderPoints.length - 2], renderPoints[renderPoints.length - 1]];
        logoSpr.x = logoSpr.originX + endPoint[0];
        logoSpr.y = logoSpr.originY + endPoint[1];
    }

    // 立即执行渲染
    (function animate() {
        TWEEN.update();
        renderer.render(stage);
        requestAnimationFrame(animate);
    })();
});