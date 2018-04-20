/**
 * Created by lea on 2017/11/15.
 */
(function(){
    var urlJson = [
        {key:"page_url_color",url:"page/page_element/color.html"},
        {key:"page_url_button",url:"page/page_element/button.html"},
        {key:"page_url_form",url:"page/page_element/form.html"},
        {key:"page_url_progress",url:"page/page_element/progress.html"},
        {key:"page_url_alert",url:"page/page_element/alert.html"},
        {key:"page_url_menu",url:"page/page_plugins/menu.html"},
        {key:"page_url_popup",url:"page/page_plugins/popup.html"},
        {key:"page_url_scroll",url:"page/page_plugins/scroll.html"},
        {key:"page_url_select",url:"page/page_plugins/select.html"},
        {key:"page_url_date",url:"page/page_plugins/date.html"},
        {key:"page_url_pagination",url:"page/page_plugins/pagination.html"},
        {key:"page_url_template",url:"page/page_plugins/template.html"},
        {key:"page_url_upload",url:"page/page_plugins/upload.html"},
        {key:"page_url_validate",url:"page/page_plugins/validate.html"},
        {key:"page_url_cate",url:"page/page_plugins/category.html"}
    ];
    var indexObj = {
        init:function(){
            indexObj.menuInit();
            indexObj.navMainTab();
        },
        menuInit: function(){
            $("li","#pageMenu").on("click",function(event){
                var $list = $(this),list_url_key = $list.data("id");
                if(list_url_key){//当前页面存在点击
                    $("li[data-id]").removeClass("active");
                    if($list.hasClass("menu-list")){
                        $("li.menu-list").removeClass("active");
                    }
                    $list.addClass("active");
                }else{
                    if($list.hasClass("active")){
                        $list.removeClass("active");
                    }else{//展开
                        $("li.menu-list").removeClass("active");
                        $list.addClass("active");
                    }
                }
                event.stopPropagation();
            });
        },
        navMainTab:function(){
            //导航和iframe
            var $navMainBox = $("#navMainBox");
            var $navBox = $navMainBox.find(".nav-box");
            var $mainBox = $navMainBox.find(".main-box");
            var mainDeal ={
                init:function(id,text){
                    var $a = $navBox.find(".nav-a[data-id='"+id+"']");
                    var $main = $mainBox.find(".lea_main[data-id='"+id+"']");
                    if(($a.length > 0||text=="")&&!$a.hasClass("active")){
                        $navBox.find(".nav-a.active").removeClass("active");
                        $mainBox.find(".lea_main.active").removeClass("active");
                        $a.addClass("active");
                        $main.addClass("active");
                    }else if(text!=""&&$a.length<=0){//添加
                        var url;
                        $.each(urlJson,function(i,urlObj){
                            if(urlObj.key == id){
                                url = urlObj.url;
                            }
                        });
                        $navBox.find(".nav-a.active").removeClass("active");
                        $mainBox.find(".lea_main.active").removeClass("active");
                        var a_html = '<a href="#" data-id="'+id+'" class="nav-a active">'+text+'<i class="iconfont icon-close-nav close-main"></i></a>';
                        var main_html = '<iframe class="lea_main active" data-id="'+id+'" name="main_'+id+'" width="100%" height="100%" src="'+url+'" frameborder="0"> </iframe>';
                        $navBox.append(a_html);
                        $mainBox.append(main_html);
                    }
                    mainDeal.dealNavShow();
                },
                dealNavShow:function(){
                    var $aActive = $navBox.find(".nav-a.active");
                    var w = document.documentElement.clientWidth||window.innerWidth;
                    var nav_w = $(".page-menu").width();
                    var a_w = parseInt($aActive.css("width"));
                    var a_left = $aActive.offset().left;
                    var box_left = parseFloat($navBox.css("margin-left"));
                    var prev_w = parseFloat($aActive.prev().css("width"));//当前单击按钮的前一个按钮
                        //&&(a_w+a_left)>w
                    var nav_a_w = a_left - nav_w;//按钮a距离左边aside的距离
                    if(0<nav_a_w){//点击的是最右边的，则向左移动【有两个宽度就左移2个，没两个宽度就移动当前这个】
                        if(nav_a_w < prev_w){//单击的按钮的前一个按钮有部分被遮住
                            box_left = box_left+prev_w - nav_a_w;
                        }else{//单击的按钮是最右边的
                            var next_w = $aActive.next();//当前单击按钮的下一个按钮
                            if(next_w.length>0){//存在下一个
                                next_w = parseFloat(next_w.css("width"))
                            }else{//不存在
                                next_w = 0;
                            }
                            var rest_w = w - a_left,minLeft=0;//minLeft:导航至少要向左边一点的位置
                            if(rest_w<a_w){//当前点击按钮被遮挡
                                minLeft = a_w - rest_w+next_w;
                            }else if(rest_w>a_w&&rest_w<a_w+next_w){//当前单击按钮存在下一个按钮，且下一个按钮被遮挡
                                minLeft = next_w - (rest_w - a_w);
                            }
                            if(minLeft!=0){
                                $navBox.find(".nav-a").each(function(){
                                    var $a = $(this),is_show_x = $a.offset().left-nav_w;
                                    if(is_show_x>0&&is_show_x >=minLeft){
                                        box_left = box_left-is_show_x;
                                        return false;
                                    }
                                });
                            }
                        }
                    }else{//小于0[单击的按钮部分被遮住]
                        box_left = box_left+Math.abs(nav_a_w)+prev_w;
                    }
                    $navBox.css({
                        marginLeft:box_left
                    });
                },
                tab:function(){//右上导航切换
                    $navBox.on("click",".nav-a",function(){
                        var $a = $(this),id = $a.data("id");
                        console.log("tab");
                        if(!$a.hasClass("close-main")){
                            mainDeal.init(id,"");
                        }
                    });
                },
                close:function(){//关闭
                    $navBox.on("click",".close-main",function(event){
                        console.log("close");
                        var $a = $(this).parents(".nav-a"),id = $a.data("id");
                        var $main = $mainBox.find(".lea_main[data-id='"+id+"']");
                        if($a.hasClass("active")){
                            var $next = $a.next();
                            var select_one = function($one){
                                var one_id = $one.data("id");
                                $one.addClass("active");
                                $mainBox.find(".lea_main[data-id='"+one_id+"']").addClass("active");
                            };
                            if($next.length>0){
                                select_one($next);
                            }else{
                                select_one($a.prev());
                            }
                        }
                        $a.remove();
                        $main.remove();
                        mainDeal.dealNavShow();
                        event.stopPropagation();
                    });
                }
            };
            mainDeal.tab();
            mainDeal.close();
            $("li","#pageMenu").on("click",function(event){
                var $list = $(this),id = $list.data("id");
                if(id){//当前页面存在点击
                    mainDeal.init(id,$list.html());
                }
                event.stopPropagation();
            });
        }
    };
    $(indexObj.init)
})();