$(document).ready(function(){
    var angles;
    var clickNum = 77;
    var rotNum = 0;
    var notice = null;
    var color = ["red","gray","rgba(0,0,0,0.5)","#DCC722","white","#FF4350"];
    var info = [];

    // 从你的 JSON 文件获取概率
    $.getJSON('probability.json', function (data) {
        // 提取国家名称和概率
        data.forEach(entry => {
            info.push({
                name: entry.国家或地区,
                probability: entry.出生概率
            });
        });

        // 调用初始化画布的函数
        canvasRun();
    });

    $('#tupBtn').bind('click',function(){
        if(rotNum > 0) {
            canvasRun();
        }
        if (clickNum >= 1) {
            clickNum = clickNum-1;
            runCup();
            $('#tupBtn').attr("disabled", true);
            rotNum = rotNum + 1;
            setTimeout(function(){
                alert("中奖号码为："+notice.name);
                $('#tupBtn').removeAttr("disabled", true);
            },6000);
        }
        else{
            alert("亲，抽奖次数已用光！");
        }
    });

    function runCup(){
        probability();
        var degValue = 'rotate('+angles+'deg'+')';
        $('#myCanvas').css('-o-transform',degValue);           //Opera
        $('#myCanvas').css('-ms-transform',degValue);          //IE浏览器
        $('#myCanvas').css('-moz-transform',degValue);         //Firefox
        $('#myCanvas').css('-webkit-transform',degValue);      //Chrome和Safari
        $('#myCanvas').css('transform',degValue);
    }

    function probability(){
        var clientUnit = (info.length % 2 == 0 ? info.length : info.length - 1);
        var num = parseInt(Math.random() * (clientUnit - 1 - 0 + 0) + 0);

        if ( num == 0 ) {
            angles = (360 * 6) * rotNum + (360 * 5);
            notice = info[0];
        } else {
            angles = (360 * 6) * rotNum + (360 * 5) + (num * 360 / clientUnit);
            notice = info[clientUnit - num];
        }

        info = deleteFromArray(info, notice);

        info = info.sort(function(){ return Math.random() - 0.5});
    }

    function deleteFromArray(info, notice) {
        var newInfo = [];
        for (var i = 0; i < info.length; i++) {
            if(notice != info[i]) {
                newInfo.push(info[i]);
            }
        }
        return newInfo;
    }

    function canvasRun(){
        var canvas=document.getElementById('myCanvas');
        var canvas01=document.getElementById('myCanvas01');
        var canvas03=document.getElementById('myCanvas03');
        var canvas02=document.getElementById('myCanvas02');
        var ctx=canvas.getContext('2d');
        var ctx1=canvas01.getContext('2d');
        var ctx3=canvas03.getContext('2d');
        var ctx2=canvas02.getContext('2d');
        createCircle();
        createCirText();
        initPoint();

        function createCircle(){
            var startAngle = 0;
            var endAngle = 0;
            var clientUnit = (clickNum % 2 == 0 ? clickNum : clickNum- 1);
            var halfclientUnit = clientUnit / 2;
            for (var i = 0; i< clientUnit; i++){
                startAngle = Math.PI*(i/halfclientUnit-1/clientUnit);
                endAngle = startAngle+Math.PI*(1/halfclientUnit);
                ctx.save();
                ctx.beginPath();
                ctx.arc(225,225,150, startAngle, endAngle, false);
                ctx.lineWidth = 220;
                if (i%2 == 0) {
                    ctx.strokeStyle =  color[0];
                } else {
                    ctx.strokeStyle =  color[1];
                }
                ctx.stroke();
                ctx.restore();
            }
        }

        function createCirText(){
            ctx.textAlign='start';
            ctx.textBaseline='middle';
            ctx.fillStyle = color[3];
            var clientUnit = (clickNum % 2 == 0 ? clickNum : clickNum- 1);
            var step = 2 * Math.PI / clientUnit;
            for ( var i = 0; i < clientUnit; i++) {
                ctx.save();
                ctx.beginPath();
                ctx.translate(225,225);
                ctx.rotate(i*step);

                if(clientUnit <= 20) {
                    ctx.font = " 18px 宋体";
                } else if(clientUnit <= 30) {
                    ctx.font = " 16px 宋体";
                } else if(clientUnit <= 40) {
                    ctx.font = " 15px 宋体";
                } else if(clientUnit <= 50) {
                    ctx.font = " 13px 宋体";
                } else if(clientUnit >= 60) {
                    ctx.font = " 12px 宋体";
                }

                ctx.fillStyle = "white";
                var y = i % 2 == 0 ? -190 : -205;
                ctx.fillText(info[i].name, 0, y, 60);
                ctx.closePath();
                ctx.restore();
            }
        }

        function initPoint(){
            ctx1.beginPath();
            ctx1.moveTo(175,6);
            ctx1.lineTo(160,143);
            ctx1.lineTo(190,143);
            ctx1.lineTo(175,6);
            ctx1.fillStyle = "green";
            ctx1.fill();
            ctx1.closePath();

            ctx3.beginPath();
            ctx3.arc(175,175,40,0,Math.PI*2,false);
            ctx3.fillStyle = "green";
            ctx3.fill();
            ctx3.closePath();

            ctx3.font = "Bold 20px Microsoft YaHei";
            ctx3.textAlign='start';
            ctx3.textBaseline='middle';
            ctx3.fillStyle = color[4];

            ctx3.beginPath();
            ctx3.fillText('开始',155,160,40);
            ctx3.fillText('抽奖',155,190,40);
            ctx3.fill();
            ctx3.closePath();

            ctx2.beginPath();
            ctx2.arc(150,150,75,0,Math.PI*2,false);
            ctx2.fillStyle = color[2];
            ctx2.fill();
            ctx2.closePath();
        }
    }
});
// ...

function createCircle(){
    var startAngle = 0;
    var endAngle = 0;
    var clientUnit = (clickNum % 2 == 0 ? clickNum : clickNum- 1);
    var halfclientUnit = clientUnit / 2;
    
    // 计算总概率
    var totalProbability = info.reduce((sum, entry) => sum + entry.probability, 0);

    for (var i = 0; i < clientUnit; i++){
        startAngle = Math.PI * (i / halfclientUnit - 1 / clientUnit);
        endAngle = startAngle + Math.PI * (1 / halfclientUnit);

        // 计算当前扇形的角度
        var sectorAngle = Math.PI * 2 * (info[i].probability / totalProbability);

        ctx.save();
        ctx.beginPath();
        ctx.arc(225, 225, 150, startAngle, startAngle + sectorAngle, false);
        ctx.lineWidth = 220;

        if (i % 2 == 0) {
            ctx.strokeStyle = color[0];
        } else {
            ctx.strokeStyle = color[1];
        }

        ctx.stroke();
        ctx.restore();
    }
}

// ...
