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
        },
        menuInit: function(){
            $("li","#pageMenu").click(function(event){
                var $list = $(this),list_url_key = $list.data("url");
                if(list_url_key){//当前页面存在点击
                    var url = "page/input.html";
                    $.each(urlJson,function(i,urlObj){
                        if(urlObj.key == list_url_key){
                            url = urlObj.url;
                        }
                    });
                    $(".L_iframe").attr("src",url);
                    $("li[data-url]").removeClass("active");
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
                console.log(111);
            });
        }
    };
    $(indexObj.init)
})();