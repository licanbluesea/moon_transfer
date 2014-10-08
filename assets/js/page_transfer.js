/**
 * Created by licanming on 14-10-8.
 */
(function($){
    $.extend({moon:{
        game_url:"http://moon.xoyobox.com",
        init:function(){
            PageUI.prototype.log_status=this.log_add;
            PageUI.prototype.loged_status=this.loged_add;
            this.page_ui();
            window.pageUI = new PageUI();
        },
        log_add:function(){
            console.log("专题没有账号登录");
            _this = $.moon;
            _this.title_change();
            $(".step_input > div").hide();
            $(".step_a1").show();
        },
        page_ui:function(){
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
        },
        loged_add:function(){
            console.log("专题有账号登录");
            $(".step_input > div").hide();


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
        }
    }});
})(jQuery);
$(function(){
    $.moon.init();
});