/**
 * Created by licanming on 14-10-8.
 */
(function($){
    $.extend({moon:{
        game_url:"http://www.licanbluesea.com:3000/migration/",
        session_url:"",
        isthird:"",
        init:function(){
            var _that = this;
            PageUI.prototype.log_status=this.log_add;
            PageUI.prototype.loged_status=this.loged_add;
            this.game_sessionId(function(){
                _that.game_isthird(function($data){
                        _that.isthird = $data.tips.thirdparty*1;
                        _that.page_ui();
                        window.pageUI = new PageUI();
                    });

            });
        },
        log_add:function(){

            _this = $.moon;
            _this.title_change();
            $(".step_input > div").hide();
            $(".step_a1").show();
        },
        page_ui:function(){
            var _that = this;
            $(".act_reg").click(function(){

                $(".step_input > div").hide();
                $(".step_a2").show();
            });
            $(".act_log").click(function(){

                $(".step_input > div").hide();
                $(".step_a3").show();
            });
            $(".esc_btn").click(function(){
                $(".step_input > div").hide();
                $(".step_a1").show();
            });
            $(".createGameaccount_btn").click(function(){
                $(".step_input > div").hide();
                $(".step_b2").show();
            });
            $(".subGameaccount_btn").click(function(){
                _that.add_gameAccount();
            });
        },
        loged_add:function(){
            //console.log("专题有账号登录");

            var _that = $.moon,_html = "";
            $(".step_input > div").hide();
            _that.game_info(function($data){
                if($data.status > 0){
                    $.each($data.tips.account,function(i,n){
                        _html += "<option value="+ n+" >"+ n+"</option>"
                    });
                    $(".step_b1  .game_account").append(_html);
                    $(".step_b1").show();
                }
                //console.log($data);
            });

        },
        add_gameAccount:function(){
            var game_account = "",game_pass = "",game_capcha =""
            if($("input[name='game_account']").val()==""){
                alert("請輸入遊戲賬號！");
                return false;
            }else{
                game_account = $("input[name='game_account']").val();
            }
            if($("input[name='game_pass']").val()==""){
                alert("請輸入遊戲密碼！");
                return false;
            }
            if($("input[name='game_pass']").val()!=$("input[name='game_repass']").val()){
                alert("請輸入相同的密碼！");
                return false;
            }else{
                game_pass = $("input[name='game_pass']").val();
            }
            if($("input[name='game_capcha']").val()==""){
                alert("請輸入驗證碼！");
                return false;
            }else{
                game_capcha = $("input[name='game_capcha']").val();
            }
            this.sub_gameAccount({"esid":this.session_url,"account":game_account,"pass":game_pass,"repass":game_pass,"vcode":game_capcha})
        },
        sub_gameAccount:function($params){
            this.game_creat($params,function($data){

            });
        },
        title_change:function($title){
            $(".step_title").removeClass("").addClass(".step_title");
            switch ($title){
                case "two":
                    break;
                case "three":
                    break;
                default :

            }
        },
        game_isthird:function($fn){
            var _that = this;
            $.ajax({
                'type': 'GET',
                'dataType': 'jsonp',
                'data':{"esid":_that.session_url},
                'url':this.game_url+"thirdparty/",
                'success':function($data){
                    if($fn){
                        $fn($data);
                    }
                }
            });
        },
        game_info:function($fn){
            var _that = this;
            $.ajax({
                'type': 'GET',
                'dataType': 'jsonp',
                'data':{"esid":_that.session_url},
                'url':this.game_url+"acclist/",
                'success':function($data){
                    if($fn){
                        $fn($data);
                    }
                }
            });
        },
        game_creat:function ($parms,$fn){
            var _that = this
            $.ajax({
                'type': 'GET',
                'dataType': 'jsonp',
                'data':$parms,
                'url':this.game_url+"reg/",
                'success':function($data){
                    _that.session_url = $data
                    if($fn){

                        $fn();
                    }
                }
            });
        },
        game_sessionId:function($fn){
            var _that = this
            $.ajax({
                'type': 'GET',
                'dataType': 'jsonp',
                'url':'https://hk.xoyobox.com/index.php?r=ExApi/GetEsessionId',
                'success':function($data){
                    _that.session_url = $data.data
                    if($fn){

                        $fn();
                    }
                }
            })
        }
    }});
})(jQuery);
$(function(){
    $.moon.init();
});