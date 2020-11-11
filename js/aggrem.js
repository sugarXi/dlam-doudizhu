$(function () {
    // 默认阅读时间
        var count = 10;
        var countdown = setInterval(CountDown, 1000);
        CountDown();
        function CountDown() {
            $("#btn").attr("disabled", true);
            $("#btn").val("返回首页（ " + count + " ）");
            $("#btn").css("opacity","0.6");
            if (count == 0) {
                console.log(count);
                $("#btn").val("返回首页").removeAttr("disabled");
                $("#btn").css("opacity","1");
                clearInterval(countdown);
            }
            count--;
        }
        
        //点击回首页
        $('#btn').click(function(){
            window.history.go(-1);
        })
});