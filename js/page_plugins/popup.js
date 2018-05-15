/**
 * Created by lea on 2017/11/20.
 */
/*-------layer 弹窗方法 start-------*/
function LayerInit(sets){
    this.sets = sets||{
            shadeClose:false,
            scrollbar:true,
            shade:.3,
            anim:9
        };
    this.loadIndex = 0;
    layer.config({
        anim: this.sets.anim //默认动画风格
    });
}
LayerInit.prototype={
    constructor:LayerInit,
    changeTitle:function(title,index){
        layer.title(title, index);
    },
    load: function (type) { //加载
        this.loadIndex = layer.load(type||0, {
            area: '60px',
            shadeClose: false,
            shade: this.sets.shade
        });
    },
    loadMsg: function (msg) {
        msg = "<img src=" + "loading.gif" + " / class='load-img'>" + msg;
        this.loadIndex = layer.alert(msg, {
            title: false,
            closeBtn: 0,
            btn: [],
            offset: '250px',
            scrollbar: false,
            shade: this.sets.shade
        });
    },
    closeLoad:function(){
        layer.close(this.loadIndex);
    },
    alert: function (content, icon) {//信息提示
        icon = icon || 1;
        return layer.alert(content, {
            icon: icon,
            offset: '250px'
        });
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
            shadeClose: this.sets.shadeClose,
            scrollbar: this.sets.scrollbar,
            shade: this.sets.shade
        }, function () {//确定事件
            if (options.yes) {
                options.yes(index);
            }else{
                layer.close(index);
            }
        }, function () {//取消事件
            if (options.cancel) {
                options.cancel(index);
            }else{
                layer.close(index);
            }
        });
        return index;
    },
    openImg: function (options, ele) {//弹出图片
        var index = layer.open({
            type: 1,
            title: options.title || false,
            closeBtn: 1,
            area: options.area || ["auto","auto"],
            skin: 'layui-layer-nobg', //没有背景色
            shadeClose: this.sets.shadeClose,
            shade: this.sets.shade,
            content: options.content //content[$(#id)]
        });
        if (ele) { ele.blur(); }
        return index;
    },
    openPhotos: function (photos, ele) {//弹出图片
        var index = layer.photos({
            photos: photos //格式见API文档手册页
            ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机
        });
        if (ele) { ele.blur(); }
        return index;
    },
    openContent: function (options) {
        var index = layer.open({
            type: 1,
            title: options.title=="undefined"?false:options.title,
            closeBtn:options.closeBtn==0?0:1,
            btn: options.btn,//例如：[]:无按钮，【“确定”】:一个按钮
            shadeClose: this.sets.shadeClose,
            scrollbar: this.sets.scrollbar,
            shade: this.sets.shade,
            area: options.area || ['450px', 'auto'],
            yes: function () {//存在确定按钮时的事件
                if (options.yes) {
                    options.yes(index);
                }else{
                    layer.close(index);
                }
            },
            btn2: function (index, layero) {//按钮【按钮二】的回调
                if (options.btn2) {//当按钮二需要执行的方法和关闭按钮的方法不一样时，执行btn2()
                    options.btn2(index);
                    return false;//开启该代码可禁止点击该按钮关闭
                } else {//反之，执行cancel方法
                    if (options.cancel) {
                        options.cancel(index);
                    }else{
                        layer.close(index);
                    }
                }
            },
            cancel: function () {
                if (options.cancel) {
                    options.cancel(index);
                }else{
                    layer.close(index);
                }
            },
            content: options.content //content[$(#id)]
        });
        return index;
    },
    openIframe: function (options) { //打开一个iframe页面
        layer.open({
            type: 2,
            title: options.title,
            shadeClose: this.sets.shadeClose,
            shade: this.sets.shade,
            area: options.area || ['360px', '90%'],
            content: options.url || "http://www.baidu.com" //iframe的url
        });
    }
};