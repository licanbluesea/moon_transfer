/**
 * Created by licanming on 14-10-8.
 */
(function($){
    $.extend({moon:{
        //game_url:"http://127.0.0.1:3000/migration/",
        game_url:"http://zt.moon.xoyobox.com/moon/migration/",
        session_url:"",
        isthird:0,
        account_name:"",
        old_account:"",
        role_id:"",
        tpaccount:"",
        role_new:0,
        init:function(){
            var _that = this;
            PageUI.prototype.log_status=this.log_add;
            PageUI.prototype.loged_status=this.loged_add;
            this.game_sessionId(function(){
                _that.page_ui();
                window.pageUI = new PageUI();
            });
        },
        log_add:function(){
            _this = $.moon;
            _this.title_change();
            $(".step_input > div").hide();
            $(".step_a1").show();
        },

        loged_add:function(){
            //console.log("专题有账号登录");
            var _that = $.moon,_html = "";
            _that.title_change("two");
            _that.game_isthird(function($data){
                if($data.status<0){
                    alert($data.tips)
                    return false;
                }
                _that.isthird = $data.tips.thirdparty*1;
                _that.game_info(function($data){
                    if(!$data.tips.length){
                        $(".step_input > div").hide();
                        $(".step_c").show();
                        //alert("該通行已经沒有可轉移的賬號！\n或登錄另一個遊戲賬號進行轉移！")
                        return false
                    }
                    $(".game_account").find("option").each(function(i,n){
                        if(i){
                            n.remove();
                        }
                    });
                    $(".step_input > div").hide();
                    _that.game_info(function($data){
                        if($data.status > 0){
                            //console.log($data.tips)
                            $.each($data.tips,function(i,n){
                                if(_that.isthird){
                                    _html += "<option value="+ n.tpAccount+" >"+ n.account+"</option>";

                                }else{
                                    _html += "<option value="+ n+" >"+ n+"</option>";
                                }
                            });
                            $(".step_b1  .game_account").append(_html);
                            $(".step_b1").show();

                        }else{
                            alert($data.tips);
                        }
                    });
                });
            });
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
            $(".login_gameaccount_btn").click(function(){
                $(".step_input > div").hide();
                $(".step_c").show();
            });

            $(".subGameaccount_btn").click(function(){
                _that.add_gameAccount();
            });
            $(".game_account").change(function(){
                var _val =$(this).find("option:selected").text();
                if(_that.isthird){
                    _that.tpaccount = $(this).attr("value");
                }else{
                    var _val = $(this).attr("value");
                }
                var _confirm = confirm("確定要使用"+_val+"這個賬號嗎？")
                if(_confirm){
                        _that.isthrid(_val);
                }else{
                        $(this).children("option").eq(0).attr("selected",true);
                }
            });
            $("#check_Gameaccount").on("click",function(){
                _that.checkgameAccount();
            });
            $(".game_role").change(function(){
                var _val = $(this).attr("value");
                if(_val){
                    var _confirm = confirm("確定要转移"+$(this).children(":selected").text()+"這個世家嗎？")
                    if(_confirm){
                        _that.transfer_role(_val);
                    }else{
                        $(this).children("option").eq(0).attr("selected",true);
                    }
                }
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
            var _that = this;
            this.game_create($params,function($data){
                if($data.status>0){
                    alert("創建新賬號成功！");
                    //console.log($params);
                    _that.account_name = $params.account;
                    if(_that.role_new){

                        _that.transfer_role(_that.role_id);
                    }else{
                        if(_that.isthird){
                            _that.role_list(_that.old_account);
                            return false;
                        }
                        $(".step_input > div").hide();
                        $(".step_c").show();
                    }
                    $("input:text,input:password").val("");
                }else{
                    $("#imgcapcha").attr("src","http://zt.moon.xoyobox.com/captcha/?t="+(new Date()).getTime());
                    alert($data.tips);
                }
            });
        },
        view_checkgameAccount:function($account){
            $(".step_input > div").hide();
            $(".step_c").show();
            $("input[name='check_Gameaccount']").val($account);
        },
        checkgameAccount:function(){
            var _Gameaccount = "",_Gamepass = "";
            if(!$("input[name='auth_Gameaccount']").attr("checked")){
                alert("請同意授權此帳號交予西山居進行登入程序！");
                return false;
            }
            if($("input[name='check_Gameaccount']").val()==""){
                alert("請輸入遊戲賬號！");
                return false;
            }else{
                _Gameaccount = $("input[name='check_Gameaccount']").val();
            }
            if($("input[name='check_Gamepass']").val()==""){
                alert("請輸入遊戲賬號！");
                return false;
            }else{
                _Gamepass = $("input[name='check_Gamepass']").val();
            }
            this.moudle_checkgameAccount({"esid":this.session_url,"account":_Gameaccount,"pass":_Gamepass});
        },
        moudle_checkgameAccount:function($params){
            var _that = this;
            this.game_checkGameaccount($params,function($data){
                if($data.status>0){
                      _that.account_name = $params.account
                     _that.old_account = $params.account;
                     _that.role_list($params.account);
                }else{
                   alert($data.tips);
                }
            });
        },
        isthrid:function($account){
            this.account_name = $account;
            if(!this.isthird){this.view_checkgameAccount($account);return false;}
            this.old_account = $account;
            this.role_list();
        },
        role_list:function($account){
            this.title_change("three");
            $(".game_role").find("option").each(function(i,n){
                if(i){
                    n.remove();
                }
            });

            this.game_rolist(
                {
                    "esid":this.session_url,
                    "account": $account || this.account_name,
                    "all":0
                },
                function($data){
                    $(".step_input > div").hide();
                    $(".step_c1").show();
                    var _html = ""
                    if(!$data.tips.length){
                       alert("您好，閣下的遊戲賬號下的世家轉移未成功，\n請確認您的賬號或重新選擇遊戲賬號及世家！");
                       location.reload();
                    }
                    $.each($data.tips,function(i,n){
                        _html += "<option value="+ n.familyid+" >"+ n.familyname+"</option>"
                    });
                    $(".game_role").append(_html);
                }
            )
        },
        transfer_role:function($role){
            var _obj,_that = this,_html = "",_table = document.getElementById("role_list_show");
            $(_table).find("tr").each(function(i,n){
                if(i){
                   n.remove();
                }
            });
            if(this.isthird &&  !this.role_new && this.tpaccount){
                _obj =  {
                    "esid":this.session_url,
                    "account":this.account_name,
                    "familyid":$role,
                    "tpAccount":this.tpaccount
                }
            }else{
                _obj =  {
                    "esid":this.session_url,
                    "account":this.account_name,
                    "familyid":$role
                }
            }
            this.game_transfer(_obj,function($data){
                var _tips = 1;
                if($data.status < 0){
                     _tips = 0;
                    alert($data.tips);
                }
                _that.role_new = 0;
                _that.transfer_rolelist(function($data){
                    $.each($data.tips,function(i,n){
                        var row = _table.insertRow(i+1);
                        var cell0 = row.insertCell(0);
                        var cell1 = row.insertCell(1);
                        cell0.innerHTML = n.familyname;

                        if(!(n.state*1)){
                            if(_that.role_id ==  n.familyid){
                                cell1.innerHTML = "<span class='no'>未轉移&nbsp;&nbsp;&nbsp;&nbsp; | 已转移至后台处理！";
                            }else{
                                 cell1.innerHTML = "<span class='no'>未轉移&nbsp;&nbsp;&nbsp;&nbsp;<a data-id='"+ n.familyid+"' id='creat_"+n.familyid+"' class='createGameaccount_btn' href='#' target='_self'>轉移至新賬號上</a></span>";
                            }
                            _that.role_id =  "";
                        }else{

                                cell1.innerHTML = "<span class='ed'>已轉移&nbsp;&nbsp;&nbsp;&nbsp;轉移賬號為：<span id='role_"+n.familyid+"'></span></span>"


                        }
                        $(".createGameaccount_btn").unbind("click").on("click",function(){
                            _that.role_id = $(this).attr("data-id");
                            _that.role_new =1;
                            $(".step_input > div").hide();
                            $(".step_b2").show();
                        });



                    });
                    _that.game_transferlist(function($data){

                        if($data.status>0){
                            $.each($data.tips,function(i,n){

                               $('#role_'+n.familyid).append(n.bindaccount);
                            });
                        }
                    });
                    $(".step_input > div").hide();
                    $(".step_d").show();
                });
                _that.account_name="";
            });
        },
        transfer_rolelist:function($fn){

            this.game_rolist(
                {
                    "esid":this.session_url,
                    "account":this.old_account,
                    "all":1
                },
                function($data){
                    if($fn){$fn($data);}
                }
            )
        },
        title_change:function($title){
            var _step = $(".step_title").removeClass("").addClass("step_title");
            switch ($title){
                case "two":
                    _step.addClass("step_two_t");
                    break;
                case "three":
                    _step.addClass("step_three_t");
                    break;
                default :

            }
        },
        game_transferlist:function($fn){
            var _that = this;
            $.ajax({
                'type': 'GET',
                'dataType': 'jsonp',
                'data':{"esid":_that.session_url},
                'url':this.game_url+"transferlist/",
                'success':function($data){
                    if($fn){
                        $fn($data);
                    }
                }
            });
        },
        game_transfer:function($params,$fn){
            var _that = this;
            $.ajax({
                'type': 'GET',
                'dataType': 'jsonp',
                'data':$params,
                'url':this.game_url+"transfer/",
                'success':function($data){
                    if($fn){
                        $fn($data);
                    }
                }
            });
        },
        game_checkGameaccount:function($params,$fn){
            $.ajax({
                'type': 'GET',
                'dataType': 'jsonp',
                'data':$params,
                'url':this.game_url+"authaccount/",
                'success':function($data){
                    if($fn){
                        $fn($data);
                    }
                }
            });
        },
        game_rolist:function($params,$fn){
            var _that = this;
            $.ajax({
                'type': 'GET',
                'dataType': 'jsonp',
                'data':$params,
                'url':this.game_url+"faclist/",
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
        game_create:function ($parms,$fn){
            var _that = this
            $.ajax({
                'type': 'GET',
                'dataType': 'jsonp',
                'data':$parms,
                'url':this.game_url+"reg/",
                'success':function($data){
                    //_that.session_url = $data
                    if($fn){

                        $fn($data);
                    }
                }
            });
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