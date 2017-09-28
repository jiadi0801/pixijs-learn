define(function (require, exports, module) {
    module.exports = {
        // 创建插值步进取样器，t=0~1 尽量均匀, points为已插值后的坐标数组
        createCSInterpolator: function (points) {
            var cumLenArr = [0];
            var cumLen = 0;
            for (var i = 2; i < points.length; i+=2) {
                cumLen += Math.sqrt(Math.pow((points[i] - points[i - 2]), 2) + Math.pow((points[i + 1] - points[i - 1]), 2));
                cumLenArr.push(cumLen);
            }
            return function (t) {
                if (t > 1) {
                    t = 1;
                }
                if (t < 0) {
                    t = 0;
                }
                // console.log(Math.floor(cumLenArr.length * t))
                // return Math.floor(cumLenArr.length * t)
                var totalLen = cumLenArr[cumLenArr.length - 1],
                    curlen = totalLen * t;
                for (var i = 1; i < cumLenArr.length; i++) {
                    if (cumLenArr[i] >= curlen) {
                        if ((cumLenArr[i] + cumLenArr[i-1]) / 2 > curlen) {
                            return i - 1;
                        } else {
                            return i;
                        }
                    }
                }
            }
        },
        // 根据原始点进行插值，得到经过cardinal spline插值函数处理后的数组
        genCardinalSplinePoints: function (pts, tension, numOfSegments) {
            tension = (tension != undefined) ? tension : 0.5;
            numOfSegments = numOfSegments ? numOfSegments : 16;

            var _pts = [],
                res = [], // clone array
                x, y, // our x,y coords
                t1x, t2x, t1y, t2y, // tension vectors
                c1, c2, c3, c4, // cardinal points
                st, st2, st3, st23, st32, // steps
                t, i, l, r = 0;

            // clone array so we don't change the original
            _pts = pts.concat();

            _pts.unshift(pts[1]); //copy 1. point and insert at beginning
            _pts.unshift(pts[0]);
            _pts.push(pts[pts.length - 2]); //copy last point and append
            _pts.push(pts[pts.length - 1]);

            l = (_pts.length - 4);
            for (i = 2; i < l; i += 2) {
                for (t = 0; t <= numOfSegments; t++) {
                    // calc tension vectors
                    t1x = (_pts[i + 2] - _pts[i - 2]) * tension;
                    t2x = (_pts[i + 4] - _pts[i]) * tension;
                    t1y = (_pts[i + 3] - _pts[i - 1]) * tension;
                    t2y = (_pts[i + 5] - _pts[i + 1]) * tension;

                    // pre-calc steps
                    st = t / numOfSegments;
                    st2 = st * st;
                    st3 = st2 * st;
                    st23 = st3 * 2;
                    st32 = st2 * 3;

                    // calc cardinals
                    c1 = st23 - st32 + 1;
                    c2 = -(st23) + st32;
                    c3 = st3 - 2 * st2 + st;
                    c4 = st3 - st2;

                    // calc x and y cords with common control vectors
                    x = c1 * _pts[i] + c2 * _pts[i + 2] + c3 * t1x + c4 * t2x;
                    y = c1 * _pts[i + 1] + c2 * _pts[i + 3] + c3 * t1y + c4 * t2y;

                    res[r++] = x;
                    res[r++] = y;

                } //for t
            } //for i

            return res;
        },
        // 将插值扩充到x间距为1像素
        quantX: function (pts) {
            var min = 99999999,
                max = -99999999,
                x, y, i, p = pts.length,
                res = [];

            for (i = 0; i < pts.length - 1; i += 2) {
                if (pts[i] > max) max = pts[i];
                if (pts[i] < min) min = pts[i];
            }
            max = max - min;

            function _getY(x) {

                var t = p,
                    ptX1, ptX2, ptY1, ptY2, f, y;

                for (; t >= 0; t -= 2) {
                    ptX1 = pts[t];
                    ptY1 = pts[t + 1];

                    if (x >= ptX1) {
                        //p = t + 2;

                        ptX2 = pts[t + 2];
                        ptY2 = pts[t + 3];

                        f = (ptY2 - ptY1) / (ptX2 - ptX1);
                        y = (ptX1 - x) * f;

                        return ptY1 - y;
                    }
                }
            }

            for (i = 0; i < max; i++) {
                res.push(i);
                res.push(_getY(i));
            }

            res.push(pts[pts.length - 2]);
            res.push(pts[pts.length - 1]);

            return res;
        },
        // 获取斜率
        getLineAngle: function (x1, y1, x2, y2) {
            var dx = x2 - x1,
                dy = y2 - y1,
                th = Math.atan2(dy, dx);

            return th * 180 / Math.PI;
        },
        // 获取另一个顶点
        lineToAngle: function (x1, y1, length, angle) {

            angle *= Math.PI / 180;

            var x2 = x1 + length * Math.cos(angle),
                y2 = y1 + length * Math.sin(angle);

            return { x: x2, y: y2 };
        }
    }
})