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
        {key:"page_url_cate",url:"page/page_plugins/category.html"},
        {key:"page_url_lazy",url:"page/page_plugins/lazyload.html"}
    ];
    jQuery.fn.menuRelate = function(options){
        var $left_li = this;
        options = $.extend({
            mainBox:"#navMainBox" //右侧内容容器
        },options||{});
        var menuLeft = {
            init:function($li,id){
                if(id){//当前页面存在点击
                    this.dealLeftTab($li,id);
                }else{//伸缩
                    if($li.hasClass("active")){//收缩
                        $li.removeClass("active");
                    }else{//展开
                        var $boss = $li.parents(".menu-list.first");
                        if(!$boss.hasClass("active")){//总父元素没展开
                            $(".menu-list.first.active").find(".menu-list").removeClass("active").end().removeClass("active");
                            $boss.find(".menu-list").addClass("active").end().addClass("active");
                        }
                        $li.addClass("active");
                    }
                }
            },
            dealLeftTab:function($li,id){//处理导航的样式【导航之前的切换】
                $("li[data-id]").removeClass("active");
                var $boss = $li.parents(".menu-list.first");
                if(!$boss.hasClass("active")){//父元素没展开
                    $(".menu-list.first.active").find(".menu-list").removeClass("active").end().removeClass("active");
                    $boss.find(".menu-list").addClass("active").end().addClass("active");
                }
                $li.addClass("active");
            }
        };
        var $mainBox = $(options.mainBox);
        var $menuBox = $mainBox.find(".nav-box");
        var $conBox = $mainBox.find(".main-box");
        var menuRight = {
            menuAddTab:function(id,text){//右侧的导航添加和切换
                var $a = $menuBox.find(".nav-a[data-id='"+id+"']");
                var $main = $conBox.find(".lea_main[data-id='"+id+"']");
                if(($a.length > 0||text=="")&&!$a.hasClass("active")){//已存在时的切换
                    $menuBox.find(".nav-a.active").removeClass("active");
                    $conBox.find(".lea_main.active").removeClass("active");
                    $a.addClass("active");
                    $main.addClass("active");
                }else if(text!=""&&$a.length<=0){//添加
                    var url;
                    $.each(urlJson,function(i,urlObj){
                        if(urlObj.key == id){
                            url = urlObj.url;
                        }
                    });
                    $menuBox.find(".nav-a.active").removeClass("active");
                    $mainBox.find(".lea_main.active").removeClass("active");
                    var a_html = '<a href="javascript:void(0);" data-id="'+id+'" class="nav-a active">'+text+'<i class="iconfont icon-close-nav close-main"></i></a>';
                    var con_html = '<iframe class="lea_main active" data-id="'+id+'" name="'+id+'" width="100%" height="100%" src="'+url+'" frameborder="0"> </iframe>';
                    $menuBox.append(a_html);
                    $conBox.append(con_html);
                }
                menuLeft.dealLeftTab($("li[data-id='"+id+"']"),id);
                menuRight.dealMenu(id);
            },
            addUrlFlag:function(id){//地址添加标记以及根据标记刷新页面
                var parent_href = window.parent.location.href;
                if(id){//flag添加
                    window.parent.location.href = parent_href.split("#")[0]+"#"+id;
                }else{//flag标记刷新
                    var hasId = parent_href.lastIndexOf("#");
                    if(hasId){
                        id=parent_href.substring(hasId+1);
                        console.log("+++++++refresh");
                        if(id!="page_url_index"){
                            $("li[data-id='"+id+"']","#pageMenu").trigger("click");
                        }
                    }
                }
            },
            dealMenu:function(id){//处理右边上面导航栏的处理以及地址处理
                menuRight.addUrlFlag(id);
                var $aActive = $menuBox.find(".nav-a.active");
                var w = document.documentElement.clientWidth||window.innerWidth;
                var nav_w = $(".page-menu").width();
                var box_left = parseFloat($menuBox.css("margin-left"));
                //当打开的导航较少，有多余空间时，设置box_left为0
                var all_width = 0,rest_width = w - nav_w;
                $menuBox.find(".nav-a").each(function(){
                    var $a = $(this);
                    all_width += parseFloat($a.css("width"));
                });
                if(all_width<=rest_width){//⑥空间够用
                    box_left = 0;
                }else{//剩余空间不够用时。
                    var a_w = parseInt($aActive.css("width"));//按钮a宽度
                    var a_left = $aActive.offset().left;//按钮a的left
                    var prev_w = parseFloat($aActive.prev().css("width"));//按钮a的prev按钮的宽度
                    var nav_a_w = a_left - nav_w; //按钮a距离左边导航右侧的距离
                    if(0 < nav_a_w){//①按钮a的左边没有被遮住
                        if(nav_a_w < prev_w){//③按钮a的prev按钮被遮住
                            box_left = box_left+prev_w - nav_a_w;
                        }else{//按钮a的prev按钮没被遮住，查看后一个按钮
                            var next_w = $aActive.next();//当前单击按钮的下一个按钮
                            if(next_w.length>0){//按钮a有next下一个按钮
                                next_w = parseFloat(next_w.css("width"));//next按钮width
                            }else{//没有
                                next_w = 0;
                            }
                            var rest_w = w - a_left,minLeft=0;//minLeft:导航至少要向左边一点的位置
                            if(rest_w<a_w){//④按钮a的右边被遮住
                                minLeft = a_w - rest_w+next_w;
                            }else if(rest_w>a_w&&rest_w<a_w+next_w){//⑤按钮a的下一个按钮被遮挡
                                minLeft = next_w - (rest_w - a_w);
                            }
                            if(minLeft!=0){
                                $menuBox.find(".nav-a").each(function(){
                                    var $a = $(this),is_show_x = $a.offset().left-nav_w;
                                    if(is_show_x>0&&is_show_x >=minLeft){
                                        box_left = box_left-is_show_x;
                                        return false;
                                    }
                                });
                            }
                        }
                    }else{//②按钮a左边部分被遮住
                        box_left = box_left+Math.abs(nav_a_w)+prev_w;
                    }
                }
                $menuBox.css({
                    marginLeft:box_left
                });
            },
            tab:function(){//右上导航切换
                $menuBox.on("click",".nav-a",function(){
                    var $a = $(this),id = $a.data("id");
                    if(!$a.hasClass("close-main")){
                        menuRight.menuAddTab(id,"");
                    }
                });
            },
            close:function(){//关闭
                $menuBox.on("click",".close-main",function(event){
                    var $a = $(this).parents(".nav-a"),id = $a.data("id");
                    var $main = $mainBox.find(".lea_main[data-id='"+id+"']");
                    if($a.hasClass("active")){
                        var $next = $a.next();
                        var select_one = function($one){
                            id = $one.data("id");
                            $one.addClass("active");
                            $mainBox.find(".lea_main[data-id='"+id+"']").addClass("active");
                        };
                        if($next.length>0){
                            select_one($next);
                        }else{
                            select_one($a.prev());
                        }
                    }
                    console.log("------------close");
                    $a.remove();
                    $main.remove();
                    menuLeft.dealLeftTab($("li[data-id='"+id+"']"),id);
                    menuRight.dealMenu(id);
                    event.stopPropagation();
                });
            },
            init:function(){
                this.tab();
                this.close();
                this.addUrlFlag();
            }
        };
        $left_li.on("click",function(event){
            var $list = $(this),id = $list.data("id");
            menuLeft.init($list,id);
            //右侧菜单关联处理
            if(id){//当前页面存在点击
                menuRight.menuAddTab(id,$list.html());
            }
            event.stopPropagation();
        });
        menuRight.init();
    };
    var indexObj = {
        init:function(){
            $("li","#pageMenu").menuRelate();
        }

    };
    $(indexObj.init)
})();