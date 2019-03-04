define(function(require,exports,module){
    var tools = require("../common/tools.js");
    var transform = require("../common/transform.js");


    //滑屏区域
    var nav = document.querySelector("#wrap > .content  .nav");
    //滑屏元素
    var list = document.querySelector("#wrap > .content  .nav >.list");

    var eleStartX = 0;
    var szStartX = 0;
    var minX = nav.clientWidth - list.offsetWidth;


    // 手动橡皮筋效果
    var lastPoint = 0; //手指上一次的位置
    var lastTime = 0;  //上一次touchmove触发的时间
    var disTime =1;
    var disPoint =0;


    nav.addEventListener("touchstart",function (ev) {
        ev = ev || event;
        list.style.transition = "none";
        var touchC = ev.changedTouches[0];
        eleStartX = transform.css(list,"translateX");
        szStartX =touchC.clientX;

        lastPoint =touchC.clientX;
        lastTime = new Date().getTime();

        // 解决速度的残留
        list.handMove = false;
        disPoint =0;
        disTime =1;
    })
    nav.addEventListener("touchmove",function (ev) {
        ev = ev || event;
        //基本滑屏逻辑
        var touchC = ev.changedTouches[0];
        var szNowX = touchC.clientX;
        var szDisX = szNowX - szStartX;
        var translateX = eleStartX+szDisX;


        // 手动橡皮筋效果
        var nowPoint = touchC.clientX; // 手指当前的位置
        var nowTime = new Date().getTime();
        disTime = nowTime - lastTime;
        disPoint = nowPoint - lastPoint; // 手指一次touchmove的距离
        lastPoint = nowPoint;
        lastTime = nowTime;

        // 让每一次手指滑动的有效距离越来越小
        var scale = 0;
        if(translateX > 0 ){
            list.handMove = true;
            scale = document.documentElement.clientWidth / ((document.documentElement.clientWidth + translateX)*2);
            translateX = transform.css(list,"translateX")+ disPoint*scale;
        }else if(translateX < minX){
            list.handMove = true;
            var over = minX - translateX;
            scale = document.documentElement.clientWidth / ((document.documentElement.clientWidth + over)*2);
            translateX = transform.css(list,"translateX") + disPoint*scale;
        }

        transform.css(list,"translateX",translateX);
    })
    nav.addEventListener("touchend",function (ev) {
        ev = ev || event;

        if(!list.handMove){
            fast(disPoint,disTime,list,)
        }else{
            var translateX = transform.css(list,"translateX");
            if(translateX > 0 ){
                translateX =0;
            }else if(translateX < minX){
                translateX =minX;
            }
            list.style.transition = "1s transform";
            transform.css(list,"translateX",translateX);
        }
    })
    function fast(disPoint,disTime,list,) {
        var speed = disPoint / disTime;
        var time = 0;
        speed = Math.abs(speed) < 0.3 ? 0 : speed;
        time = Math.abs(speed)*0.2;
        time = time>2?2:time;
        time = time<0.4?0.5:time;
        console.log(speed)

        var translateX = transform.css(list,"translateX");
        var targetX =  translateX + speed*200;

        //快速滑屏的橡皮筋效果
        var bsr = "";
        if(targetX > 0 ){
            targetX =0;
            bsr = "cubic-bezier(.09,1.51,.65,1.73)";
        }else if(targetX < minX){
            targetX = minX;
            bsr = "cubic-bezier(.09,1.51,.65,1.73)";
        }

        list.style.transition = time+"s "+bsr+" transform";
        transform.css(list,"translateX",targetX);
    }


    //点击变色
    changeColor();
    function changeColor() {
        var liNodes = document.querySelectorAll("#wrap > .content  .nav >.list li");
        var list = document.querySelector("#wrap > .content  .nav >.list");
        var nav = document.querySelector("#wrap > .content  .nav");
        nav.addEventListener("touchstart",function () {
            nav.isMoved = false;
        })
        nav.addEventListener("touchmove",function () {
            nav.isMoved = true;
        })

        list.addEventListener("touchend",function (ev) {
            ev = ev || event;
            if(!nav.isMoved){
                for (var i = 0; i < liNodes.length; i++) {
                    tools.removeClass(liNodes[i], "active");
                }
                if (ev.target.nodeName.toUpperCase() === "LI") {
                    tools.addClass(ev.target, "active")
                } else if (ev.target.nodeName.toUpperCase() === "A") {
                    tools.addClass(ev.target.parentNode, "active")
                }
            }
        })
    }
})