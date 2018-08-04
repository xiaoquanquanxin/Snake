var centerEle;
var start = true;
//  位置 二维数组
var lis = [];
//   蛇头
var snakeHead = null;
//  被点击过
var clicked = false;
//  头部轴向
var xAxis, yAxis;
//  食物位置
var xFood, yFood;
//  按键方向
var code;
//  记录运动轨迹的数组
var runTrack = [];
//  我要删除的尾部
var deleteTail = [];
//  分数与称号
var score = 0;
var cheng = null;

//  是否可以产生下个一食物?
var canCreate = true;
//  方向定时器
var timer = null;
//  阀
var valve = null;
//  速度
var speed = 100;
window.onload = function () {
    var personalScore = document.getElementById("personalScore");
    var personalName = document.getElementById("personalName");
    centerEle = document.getElementsByTagName("center")[0];
    initFN(start, false);
    //initFN(false, clicked);
    //  开始新
    document.getElementById("reset").onclick = function () {
        initFN(false, clicked);
        clicked = true;
        createFooood();
    };

    var bank = true;
    var onceBank = true;
    //  按键
    document.onkeyup = function (e) {
        //  38 40 37 39
        if (!(e.keyCode == 38 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 40)) {
            return false
        }
        //  不能回头望月
        if (Math.abs(valve - e.keyCode) == 2) {
            return false
        }
        code = e.keyCode;
        if (onceBank) {
            if (bank) {
                defineDirection(code, xAxis, yAxis);
                onceBank = false;
            }
            clearTimeout(timer);
            timer = setTimeout(james, speed);
            bank = false;
            return false
        } else {
            code = e.keyCode
        }
        function james() {
            bank = true;
            defineDirection(code, xAxis, yAxis);
            timer = setTimeout(james, speed);
        }
    };
};

//  初始化
function initFN(start, isDisabled) {
    if (start) {
        var str = "";
        for (var i = 0; i < 7; i++) {
            str += "<ul class='tanRow'>";
            for (var j = 0; j < 7; j++) {
                str += "<li>" + upWei(j) + ",0" + i + "</li>"
            }
            str += "</ul>"
        }
        centerEle.innerHTML = str;
        var tanRow = document.getElementsByClassName("tanRow");
        lis = [];
        for (i = 0; i < tanRow.length; i++) {
            lis[i] = tanRow[i].getElementsByTagName("li");
        }
    }
    else if (!isDisabled) {
        xAxis = randomFN(0, 6);
        yAxis = randomFN(0, 6);
        renderHead(xAxis, yAxis);
        runTrack = [[xAxis, yAxis]]
    }
}
//  定义方向
function defineDirection(dir, x, y) {
    valve = dir;
    //console.log(x, y);
    if (dir == 26 || typeof y != "number") {
        return false;
    } else {
        switch (dir) {
            case  38:
                y--;
                break;
            case  40:
                y++;
                break;
            case  37:
                x--;
                break;
            case  39:
                x++;
                break;
        }
        if (y > 6 || y < 0 || x > 6 || x < 0) {
            clearTimeout(timer)
            return false
        }
        yAxis = demarcationYAxis(y);
        xAxis = demarcationXAxis(x);
        if (xAxis == xFood && yAxis == yFood) {
            console.log("碰撞了");
            score++;
            personalScore.innerHTML = score + "";
            if (score >= 10) {
                cheng = "得分";
                personalName.innerHTML = cheng;
            }
            canCreate = true;
            createFooood()
        }
        else {
            deleteTail = runTrack.shift();
            //runTrack.shift();
        }
        runTrack.push([xAxis, yAxis]);
        //console.log(runTrack.join(""))

        renderBody(runTrack);
        renderHead(xAxis, yAxis);

        for (var i = 0; i < runTrack.length -1; i++) {
            console.log(runTrack[i])
            if (runTrack[i][0] == xAxis && runTrack[i][1] == yAxis) {
                alert("撞了");
                alert("重来")
            }
        }
        console.log([x, y])
        //console.log( y)
    }
}
//  限界
function demarcationYAxis(n) {
    n = Math.min(n, 6);
    n = Math.max(n, 0);
    return n;
}
function demarcationXAxis(n) {
    n = Math.min(n, 6);
    n = Math.max(n, 0);
    return n;
}
//  渲染头部位置
function renderHead(x, y) {
    snakeHead = lis[y][x];
    snakeHead.style.backgroundColor = "skyblue";
}
function renderBody(arr) {
    for (var i = 0; i < arr.length; i++) {
        lis[arr[i][1]][arr[i][0]].style.backgroundColor = "plum"
    }
    lis[deleteTail[1]][deleteTail[0]].style.backgroundColor = ""
    lis[yFood][xFood].style.backgroundColor = "lawngreen";
}
//  食物
function createFooood() {
    if (!canCreate) {
        return false
    }
    xFood = randomFN(0, 6);
    yFood = unSamePos();
    console.log(lis[yFood][xFood])
    lis[yFood][xFood].style.backgroundColor = "lawngreen";
    canCreate = false;
}
//  防止位置重复
function unSamePos() {
    yFood = randomFN(0, 6);
    if (xFood == xAxis) {
        if (yFood == yAxis) {
            unSamePos()
        }
    }
    return yFood
}

//  上位
function upWei(n) {
    if (n <= 9) {
        n = "0" + n;
    }
    return n
}
//  随机数
function randomFN(min, max) {
    return Math.floor(Math.random() * (max - min + 1) - min)
};
