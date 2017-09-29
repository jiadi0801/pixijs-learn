
# JS动画（1）- CSS动画到JS动画

## 前言
这是一个系列文章，在利用JS动画进行开发时的一些总结，欢迎大家交流。
* JS动画（1）- CSS动画到JS动画
* JS动画（0）- 京东总部大厦流光效果
* JS动画（0）- 抛物运动下的粒子效果
* JS动画（0）- 绘制一条自定义路径
* JS动画（0）- 物体沿自定义路径运动
* JS动画（0）- 物体沿自定义路径匀速运动

## 正文
动画的核心是关键帧，在CSS3中，我们用`@keyframes`定义一组关键帧，利用`animation`属性对关键帧进行切换。如果我们对CSS3动画能进行熟练运用的话，那么接下来的文章就好理解了。

CSS3动画可以描述为：

在规定时间`t`内，按照某一个插值函数`f(t)`计算某个时刻的属性值，插值函数由缓动函数以及上一关键帧和本关键帧里定义的属性决定。
```
f = g(animation-timing-function, keyframe-attributes)
```

相应的，如果要做JS动画，那我们需要准备三样东西：<b>缓动函数</b>，<b>属性初始值</b>和<b>属性目标值</b>。

在很多JS库中，预定义了类似CSS3的`linear ease-out`的缓动函数，以`tween.js`库为例，它的缓动函数都处于`TWEEN.Easing`命名空间中，一共有31种，远比CSS3的丰富。

给定一个CSS3平移动画示例，我们用`tween.js`来实现这个动画。

```CSS
.box {
    width: 50px;
    height: 50px;
    animation: trans 3s linear;
}
@keyframes trans {
    0%  {transform: translateX(0)}
    100% {transform: translateX(100px)}
}
```

上述CSS描述了在3秒时间内，将`.box`平移100像素，用tween.js描述如下：
```JS
    var box = document.querySelector('.box');

    new TWEEN.Tween({x: 0})
    .to({x: 100}, 3000)
    .easing( TWEEN.Easing.Linear.None )
    .onUpdate(function (obj) {
        box.style.transform = 'translateX('+ obj.x +'px)';
    })
    .start();

    move();
    function move() {
        TWEEN.update();
        requestAnimationFrame(move);
    }
```

[CODEPEN](https://codepen.io/jiadi0801/pen/BwRxPq)

`new TWEEN.Tween({x: 0})`创建一个具有初始值的缓动对象，这个初始对象很有意思，如果它就是我们要修改的对象，那么不用写onUpdate函数就能自动更新这个对象里的值。

`.to({x: 100}, 3000)`指明缓动对象中`x`属性的目标值，并指定缓动时间`3000`毫秒。

`new TWEEN.Tween({x: 0}).to({x: 100}, 3000)`就像定义了一组`@keyframes`关键帧。

`.easing( TWEEN.Easing.Linear.None )`指明缓动函数。

至此，JS动画所需要的三样东西就准备齐全了。

CSS3会帮我们启动动画，自动更新transform属性，自动刷新每一帧，而在JS中则需要我们手动启动。

`.start()`将打开动画开关，它打开了并不代表`x`值就会更新，需要用`TWEEM.update()`来触发`x`值的刷新。

JS中刷新帧的执行函数为`requestAnimationFrame`，在执行函数`move`中，执行`TWEEN.update()`触发TWEEN的缓动实例更新，比如某个时刻`x:0.1320`更新为`x:0.1325`。

最后，每个缓动对象都有一个`onUpdate`函数，这里我们可以自定义更新操作。

JS动画库大多都是包含以上几个要素。根据库扩展功能不同，有些库在缓动函数方面有优势，有些库在管理时间轴上有优势，但总的来说理念是相同的，选择一款合适的JS库即可。

推荐的JS动画库：
* [tween.js - 轻量独立的动画库](https://github.com/tweenjs/tween.js)
* [GreenSock的GSAP系列 - 生态丰富](https://github.com/greensock/GreenSock-JS)
* [mojs - 一个字，强](https://github.com/legomushroom/mojs)