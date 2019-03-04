define(function(require,exports,module){

    require("./buss/base.js");
    require("./buss/head.js");
    require("./buss/nav.js");
    var slide = require("./buss/slide.js");
    var sxhp = require("./buss/sxhp2.js");
    require("./buss/tap.js");
    var transform = require("./common/transform.js");

    window.onload=function () {
        var arr=["./img/1.jpg","./img/2.jpg","./img/3.jpg","./img/4.jpg","./img/5.jpg"];
        slide.course(arr);


        //滚动条的逻辑
        var scrollBar = document.querySelector("#wrap .bar");
        var head =  document.querySelector("#wrap .head");
        var content =  document.querySelector("#wrap .content");
        var list =  document.querySelector("#wrap .content > div");
        var scale = 0;
        setTimeout(function () {
            scale = content.clientHeight / list.offsetHeight ;
            scrollBar.style.height = scale * document.documentElement.clientHeight +"px";
        },200)
        var callBack ={
            start:function () {
                scrollBar.style.opacity = 1;
            },
            move:function () {
                scrollBar.style.opacity = 1;
                // 滚动条位移的实时距离 / 滚动条位移的最大距离 = 内容区位移的实时距离 / 内容区位移的最大距离
                // 滚动条位移的实时距离 = (内容区位移的实时距离 / 内容区位移的最大距离) * 滚动条位移的最大距离
                var scale = transform.css(this,"translateY") / (this.offsetHeight - content.clientHeight);
                var translateY = scale * (document.documentElement.clientHeight - scrollBar.offsetHeight);
                transform.css(scrollBar,"translateY",-translateY);
            },
            end:function(){
                scrollBar.style.opacity = 0;
            },
            over:function () {
                scrollBar.style.opacity = 0;
            }
        }


        sxhp.move(content,list,callBack);
    }
})


