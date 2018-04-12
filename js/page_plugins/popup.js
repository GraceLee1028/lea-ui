/**
 * Created by lea on 2017/11/20.
 */
/*-------layer 弹窗方法 start-------*/
window.LayerInit = {
    options: {
        scrollbar:true,
        shade:.3
    },
    init: function (options) {
        options = options || {};
        LayerInit.options = jQuery.extend({}, LayerInit.options, options);
        //弹窗全局设置
        layer.config({
            anim: 9 //默认动画风格
        });
    },
    changeTitle: function (title, index) {//修改某个层的标题，index: 某个层
        layer.title(title, index);
    },
    load: function (type) { //加载
        type = type || 0;
        var index = layer.load(type, {
            area: '60px'
        });
        return index;
    },
    alert: function (content, icon) {//信息提示
        icon = icon || 1;
        var index = layer.alert(content, {
            icon: icon,
            offset: '250px'
        });
        return index;
    },
    confirm: function (options) {
        var btn = options.btn || ['确定', '取消'];
        var index = layer.confirm(options.msg, {
            title: options.title || '提示',
            btn: btn, //按钮
            success: function (layero, index) {
                $(document).off('keydown').on('keydown', function (e) {
                    if (e.keyCode == 13) {
                        $(".layui-layer").focus();
                        if (options.ok) { options.ok(); }
                        layer.close(index);
                        if (e && e.preventDefault) {
                            e.preventDefault();
                        } else {
                            window.event.returnValue = false;
                        }
                    }
                })
            },
            offset: '250px',
            shadeClose: true,
            scrollbar: true,
            shade: LayerInit.options.shade
        }, function () {//确定事件
            if (options.yes) { options.yes(); }
            layer.close(index);
        }, function () {//取消事件
            if (options.cancel) { options.cancel(); }
            layer.close(index);
        });
    },
    openImg: function (options, ele) {//弹出图片
        var index = layer.open({
            type: 1,
            title: options.title || false,
            closeBtn: 1,
            area: options.area || "auto",
            //            skin: 'layui-layer-nobg', //没有背景色
            shadeClose: true,
            shade: LayerInit.options.shade,
            content: options.content //content[$(#id)]
        });
        if (ele) { ele.blur(); }
        return index;
    },
    openContent: function (options) {
        var index = layer.open({
            type: 1,
            title: options.title || "内容标题",
            closeBtn: 1,
            btn: options.btn,//例如："":无按钮，【“确定”】:一个按钮
            shadeClose: true,
            shade: LayerInit.options.shade,
            area: options.area || ['450px', '410px'],
            yes: function () {//存在确定按钮时的事件
                if (options.yes) { options.yes(); }
            },
            content: options.content //content[$(#id)]
        });
        return index;
    },
    openIframe: function (options) { //打开一个iframe页面
        layer.open({
            type: 2,
            title: options.title,
            shadeClose: true,
            shade: LayerInit.options.shade,
            area: options.area || ['360px', '90%'],
            content: options.url || "http://www.baidu.com" //iframe的url
        });
    }
};
jQuery(function () {
    LayerInit.init();
});
/*---------layer 弹窗方法 end ------*/
(function(){
   var popUp = {
       init: function(){
           popUp.layerObj.init();
       },
       layerObj:{
           init:function(){
               $("#layerMsg").click(function(){layer.msg("hello")});
               $("#layerLoad").click(function(){
                   LayerInit.load(0);
               });
               layer.tips("Hi，我是tips", "#layerTip");
               $("#layerConfirm").click(function(){
                   LayerInit.confirm({
                       title: "删除确认",
                       area: ["350px", "200px"],
                       btn: ["确定", "取消"],
                       yes: function () {
                       },
                       cancel: function () {
                           layer.closeAll();
                       },
                       msg: "<p class='p-text'>确定要删除本条商品记录？</p>"
                   });
               });
               $("#layerConfirm0").click(function(){
                   LayerInit.confirm({
                       title: "删除确认",
                       area: ["350px", "200px"],
                       btn: ["确定", "取消"],
                       yes: function () {
                       },
                       cancel: function () {
                           layer.closeAll();
                       },
                       msg: "<p class='p-text'>确定要删除本条商品记录？</p>"
                   });
               });
           }

       }
   };
    $(popUp.init)
})();