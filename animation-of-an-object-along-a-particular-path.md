
# JS动画（1）- CSS动画到JS动画

## 前言
这是一个系列文章，在利用JS动画进行开发时的一些总结，欢迎大家交流。
* JS动画（1）- CSS动画到JS动画
* JS动画（0）- 京东总部大厦流光效果
* JS动画（0）- 抛物运动下的粒子效果
* JS动画（0）- 绘制一条自定义路径
* JS动画（0）- 物体沿自定义路径运动
* JS动画（0）- 物体沿自定义路径匀速运动


## CSS3动画在JS中实现
动画的核心是关键帧，在CSS3中，我们用`@keyframes`定义一组关键帧，利用`animation`属性对关键帧进行切换。如果我们对CSS3动画能进行熟练运用的话，那么接下来的文章就好理解了。

CSS3动画可以描述为：

在规定时间`t`内，按照某一个插值函数`f(t)`计算某个时刻的属性值，插值函数由缓动函数以及上一关键帧和本关键帧里定义的属性决定。
```
f = g(animation-timing-function, keyframe-attributes)
```

相应的，如果要做JS动画，那我们需要准备三样东西：<b>缓动函数</b>，<b>属性初始值</b>和<b>属性目标值</b>。

在很多JS库中，预定义了类似CSS3的`linear ease-out`的缓动函数，以`tween.js`库为例，它的缓动函数都处于`TWEEN.Easing`命名空间中，一共有31中，远比CSS3的丰富。

下面以`tween.js`为例来实现这个CSS3平移动画。

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

`new TWEEN.Tween({x: 0})`创建一个具有初始值的缓动对象，这个初始对象很有意思，如果它就是我们要修改的对象，那么不用写onUpdate函数就能自动更新。

`.to({x: 100}, 3000)`指明缓动对象中`x`属性的目标值，并指定缓动时间`3000`毫秒。到这里为止，我们定义了一个类似CSS3的`@keyframes`。

`.easing( TWEEN.Easing.Linear.None )`指明缓动函数。JS所需要的三样东西就准备齐全了。

不同的是，CSS3会帮我们启动动画，自动更新transform属性，自动刷新每一帧。而在JS中则需要我们手动启动。

`.start()`将打开动画开关，但它打开了并不代表`x`值就会更新，需要用`TWEEM.update()`来触发`x`值的刷新。

JS中刷新帧的执行函数为`requestAnimationFrame`，在执行函数中，执行`TWEEN.update()`触发TWEEN的缓动实例更新，

`TWEEN.Easing.Linear.None`这个函数为tween.js的线性缓动函数



## 参考文章
* http://pixijs.download/release/docs/index.html
* https://stackoverflow.com/questions/17083580/i-want-to-do-animation-of-an-object-along-a-particular-path