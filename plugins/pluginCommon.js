/*
 *公用
 * 公用的一些组件，自定义插件【步骤step,底部样式】,已有插件的再封装【layer,pagination,select2】，
 * 扩展的jquery方法
 * update 20171130 by lifeng
 */
/*----------js公用方法------------- start*/
//地址相关处理
function Url(url){
    this.url = decodeURIComponent(url||window.location.href);
}
Url.prototype = {
    constructor:Url,
    isUrl: function () {//检测是否是网址
        var val = this.url;
        if (val.indexOf("?")) {
            val = val.split("?")[0];
        }
        var regUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return regUrl.test(val);
    },
    getUrlArgs: function(){//得到地址传递的参数，返回： 参数对象
        var argsString = (this.url.indexOf('?') === -1)?"":this.url.substring(this.url.indexOf('?')+1);
        var obj={};
        if(argsString !== ""){
            argsString = argsString.split('&');
            for(var i=0;i<argsString.length;i++){
                var key = argsString[i].split('=')[0];
                obj[key] = argsString[i].split('=')[1];
            }
        }
        return obj;
    }
};
//value 处理【trim,类型判断】
function ValueO(val){
    this.value = val;
}
ValueO.prototype = {
    constructor:ValueO,
    trim:function(){
        var reg = /(^\s*)|(\s*$)/g;
        this.value.replace(reg, '')
    },
    //逗号全角转半角
    toCDB:function(){
        var tmp = "",str = this.value;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
                tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
            }else {
                tmp += String.fromCharCode(str.charCodeAt(i));
            }
        }
        return tmp
    },
    deleteLastComma:function(){//删除尾部的逗号[全角半角都删除]
        var reg = /(\,|\，)+$/;
        return this.value.replace(reg,"");
    },
    decimalDeal: function(decimal){//小数点处理，小数位为.00时，转换为整数
        decimal = decimal||2;
        var val = this.value.toFixed(decimal).toString();
        if(parseInt(val.substring(val.indexOf('.')+1)) == 0){
            val = parseInt(val);
        }
        this.value = val;
    },
    isString: function () {
        return typeof this.value === "string";
    },
    isNumber: function () {
        return typeof this.value === "number";
    },
    isUndefined: function(){
        return typeof this.value === "undefined";
    },
    isFunction:function(){
        return this.value instanceof Function;
    },
    isArray: function () {
        return this.value instanceof Array;
    }
};
function Time(time,format){
    this.time = time;
    this.format = 1;
}
Time.prototype = {
    constructor:Time,
    /**
     *时间戳转换成具体的时间，进行不同格式的显示
     * @param time 时间戳[毫秒]
     * @param typeFormat 返回时间的格式【默认格式：1】【1:2017年04月25日 07:15:10】
     * @returns {*}【 2:2017-04-25 07:15】 【3:2017-04-25 23:59】(某天时间的最后时间)【4：时间对象】
     */
    getTimeDetail: function () {
        var dateTime,typeFormat =this.format;
        if(this.time === 'now'){
            dateTime = new Date();
        }else{
            dateTime = new Date(this.time);
        }
        var zeroAdd = function (val) {
            if (val < 10) {
                val = "0" + val;
            }
            return val;
        };
        var detail = {
            year: dateTime.getFullYear(),  //年
            month: zeroAdd(parseInt(dateTime.getMonth() + 1)),    //月
            date: zeroAdd(dateTime.getDate()),       //日
            hour: zeroAdd(dateTime.getHours()),   //时
            minute: zeroAdd(dateTime.getMinutes()),  //分
            second: zeroAdd(dateTime.getSeconds()),  //秒
            week: dateTime.getDay()       //星期几[0:表示星期天，1-6: 星期一到星期六]

        };
        if (typeFormat == 1) {
            return detail.year + "年" + detail.month + "月" + detail.date + "日    " + detail.hour + ":" + detail.minute + ":" + detail.second;
        }else if(typeFormat == 2){
            return detail.year + "-" + detail.month + "-" + detail.date +" "+ detail.hour + ":" + detail.minute;
        }else if(typeFormat == 3){
            return detail.year + "-" + detail.month + "-" + detail.date +" 23:59";
        }else if(typeFormat == 4){
            return detail.year + "-" + detail.month + "-" + detail.date;
        }else {
            return detail;
        }
    },
    addDay: function(startDate, day){//通过增加的天数，得到相对应得秒数
        if(typeof startDate === "string"){
            startDate = new Date(startDate.replace(/\-/g,'/'));
        }
        this.time = startDate;
        this.format = 3;
        var dayLast = this.getTimeDetail().replace(/\-/g,'/');//当前某天的最后时间
        var seconds = (new Date(dayLast)).getTime();
        return (seconds + (day-1)*24*60*60*1000);
    },
    /**
     * 得到时间的差值 X天X时
     * @param bt 开始时间
     * @param et 结束时间
     * @returns {number}
     */
    getTimeDiff: function(bt,et){
        if(typeof bt === "string"){bt = new Date(bt.replace(/\-/g,'/'));}
        et = new Date(et.replace(/\-/g,'/'));
        var diff = Math.abs(bt.getTime() - bt.getTime());
        return Math.floor(diff/(24*60*60*1000));
    },
    compareTime: function(bt, et){//时间比较,return 【true：bt < et, false: bt>et】
        if(typeof bt === "string"){bt = new Date(bt.replace(/\-/g,'/'));}
        if(typeof et === "string"){
            et = new Date(et.replace(/\-/g,'/'));
        }
        if(bt < et){
            return true;
        }else{
            return false;
        }
    },
    removeSeconds: function(val){//删除秒
        return val.substring(0,val.length-3);
    }
};
console.log(Time);
window.CL = {
    getBodyWH: function () {//得到当前页面实际宽，可视区域高
        var clientW = (document.documentElement.clientWidth || document.body.clientWidth);
        var clientH = (document.documentElement.clientHeight || document.body.clientHeight);
        var w = clientW < 1200 ? 1000 : clientW;
        return { w: w, h: clientH };
    },
    //阻止默认事件
    preventDefault:function(e) {
        if (e && e.preventDefault) {
            e.preventDefault();
        } else {
            window.event.returnValue = false;
        }
    },
    getScrollTop:function(){
        return document.documentElement.scrollTop||window.pageYOffset||document.body.scrollTop;

    },
    setScrollTop:function(val){
        document.documentElement.scrollTop = val;
        window.pageYOffset = val;
        document.body.scrollTop = val;
    }
};
/*----------js公用方法-------------end*/
/*---------jquery 方法扩展 start ------*/
$.extend({
    onlyNumber: function (ele) { //文本框只能输入数字
        ele.on('keyup', function (event) {
            var $this = $(this);
            $this.val($this.val().trim().replace(/[^\d.]/g, ''));
        });
    },
    /**
     * @param ele  分页容器
     * @param num_entries  //数据总数
     * @param pageselectCallback  //回调函数
     * @param per_items  //每页显示的数据条目
     */
    paging: function (ele, options) {
        options["per_items"] = options["per_items"] || 10;
        //ele:分页容器【如：$("#id")】
        //options["num_entries"]：总数据条数
        ele.pagination(options["num_entries"], {
            current_page: 0,
            callback: options.callback,//       必填
            items_per_page: options["per_items"], //每页显示10项
            load_first_page: false,
            num_edge_entries: 1, //边缘页数
            num_display_entries: 4, //主体页数
            prev_text: "上一页",
            next_text: "下一页",
            pager_other:options["pager_other"]?options["pager_other"]:"",
            first_text:options["first_text"]?options["first_text"]:"首页",//是否有首页
            last_text:options["last_text"]?options["last_text"]:"尾页",//是否有尾页:[为空表示没有，默认为空]
            link_has_button:options["link_has_button"]?options["link_has_button"]:false//是否可以 跳转页数,默认，false不行
        });
    },
    /* select2 插件【有搜索框】，数据初始*/
    selectByData: function (ele, data,tip) {//针对某个特用的
        //tip:查询无结果的提示文字
        tip = tip||"查无结果";
        //ele:选择框容器【如：$("#id")】
        ele.select2({ //此处用于select2的初始化数据
            "language": {
                "noResults": function () {
                    return tip;
                }
            },
            data: data
        });
    },
    /* select2 插件【通用有搜索框】*/
    selectSearch: function ($ele,size,tip) {
        //tip:查询无结果的提示文字
        tip = tip||"查无结果";
        //带search的select2
        var $ele = $ele || $('select');
        $ele.select2({
            "language": {
                "noResults": function () {
                    return tip;//【无结果后，显示中文提示】
                }
            },
            maximumSelectionSize: size || 10// 限制数量
        });
    },
    /* select2 插件【通用无搜索框】*/
    selectNotSearch: function ($ele) {
        var $ele = $ele || $('select');
        $ele.select2({
            minimumResultsForSearch: Infinity
        });
    },
    /**
     * 日期控件 layDate
     * @param options 【绑定的元素elem必传】
     */
    initLayDate: function (options) {//对日期控件进行初始化
        var settings = {
            elem: "#id",
            type: "datetime",//datetime:年、月、日、时、分、秒,time:时分秒；date：年月日[默认]，month：年月
            format:"yyyy-MM-dd HH:mm:ss",//如：yyyy年MM月dd日、HH时mm分ss秒、dd/MM/yyyy
            value:new Date(),//当前的时间值
            min: "2017-01-01 00:00:00",
            max: "2099-01-01 00:00:00",//日期有效范围限定在：过去一周到未来一周:,min: -7 //7天前,max: 7 //7天后
            showBottom:true,// - 是否显示底部栏
            btns: ["clear","now", "confirm"],
            theme: "molv",//多种主题:自定义背景色主题:red
            calendar:true, //- 是否显示公历节日[默认：false]
            mark: {
                '0-11-21': '生日'
            },
            change: function(value, date, endDate){
                //alert(value); //在控件上弹出value值
                //console.log(date);
                $(".laydate-btns-confirm").click();//确定事件的触发
            },
            done: function(value, date){
                if(date.year === 2017 && date.month === 11 && date.date === 21){ //点击2017年8月15日，弹出提示语
                    laydateObj.hint('中国人民抗日战争胜利万岁');
                }
            }
        };
        options = jQuery.extend({}, settings, options);
        var laydateObj = laydate.render(options);
    },
    /*模板控件 template-web 过滤器*/
    templateInit: function () {
        //对template模板设置全局变量
        template.defaults.imports.dateFormat = function (date, format) {
            //console.log(date);
            var date =new Date(date);
            if (format == 1) {
                date = window.CL.getTimeDetail(date, 1);
            } else if (format == 2) {
                date = window.CL.getTimeDetail(date, 2);
            }
            return date;
        };
    },
    /**
     * get 方式，返回类型 json【包含code,对code进行处理】
     * @param url
     * @param d
     * @param callback
     */
    ajaxByGet: function (url, d, callback,noload) {
        noload = noload ? true : false;
        if (!noload) {
            var loadIndex = window.LayerInit.load();
        }
        jQuery.ajax({
            url: url,
            type: "GET",
            data: d,
            dataType: "json",
            success: function (data) {
                switch (data.code) {
                    case 1000:
                        layer.msg("服务端错误：" + data.msg);
                        break;
                    case 1002://系统授权过期
                        CL.authAli();//1688授权
                        break;
                    default://其它情况【包含成功】[无特殊情况，则属于10001成功]
                        if (data.msg != "") {
                            layer.msg(data.msg);
                        }
                        if (CL.isFunction(callback)) { callback(data); }
                }
                if (!noload) {
                    layer.close(loadIndex);
                }
            },
            error: function () {
                if (!noload) {
                    layer.close(loadIndex);
                }
                layer.msg("获取数据失败请稍后再试！");
            }
        });
    },
    /**pc端
     * post 方式，返回类型 json【包含code,对code进行处理】
     * @param url
     * @param d
     * @param callback
     */
    ajaxByPost: function (url, d, callback,noload) {
        noload = noload? true : false;
        if (!noload) {
            var loadIndex = window.LayerInit.load();
        }
        jQuery.ajax({
            url: url,
            type:"POST",
            data: d,
            dataType:"json",
            success: function (data) {
                switch (data.code) {
                    case 1000:
                        layer.msg("服务端错误：" + data.msg);
                        break;
                    case 1002://系统授权过期
                        CL.authAli();//1688授权
                        break;
                    default://其它情况【包含成功】[无特殊情况，则属于10001成功]
                        if (data.msg != "") {
                            layer.msg(data.msg);
                        }
                        if (CL.isFunction(callback)) { callback(data); }
                }
                if (!noload) {
                    layer.close(loadIndex);
                }
            },
            error: function () {
                if (!noload) {
                    layer.close(loadIndex);
                }
                layer.msg('获取数据失败请稍后再试！');
            }
        });
    },
    limitNum: function (ele) { //文本框只能输入数字
        ele.on('keyup', function (event) {
            var $this = $(this);
            $this.val($this.val().trim().replace(/[^\d.]/g, ''));
        });
    },
    tooltip: function () {
        jQuery("[title]").attr("data-toggle", "tooltip");
        jQuery('[data-toggle="tooltip"]').tooltip();
    }
});
//全选
jQuery.fn.checkAll = function (options) {
    "use strict";
    options = options || {};
    var $selectAllEle = this;//$("#selectAll");
    var selectObj = {
        settings: {
            child: $("input[type=checkbox]"),//$("input[type=checkbox]");
            callback: function (isCheckAll) {//全选时的操作
                console.log("checkbox 全选完成后的事件");
            },
            itemCallback: function () {//每一项单击时的操作
                console.log("每一项选择绑定事件");
            }
        },
        isCheckAll: function () {//是否全选【存在没有选中的全选，true:全选；false:不全选【反选】】
            var isChecked = true;
            selectObj.settings.child.each(function () {
                if (!$(this).hasClass("checked")) {
                    isChecked = false;
                    return false;
                }
            });
            return isChecked;
        },
        selectClick: function(){
            $selectAllEle.off("click").on('click', function () {
                var $all = $(this), isCheckAll = $all.prop("checked");
                //console.log(isCheckAll);
                if (isCheckAll) {//全选
                    selectObj.settings.child.addClass("checked").prop("checked", true);
                } else {//全不选
                    selectObj.settings.child.removeClass("checked").prop("checked", false);
                }
                selectObj.settings.callback(isCheckAll);//true:全选，false:全不选
            });
        },
        itemClick: function () {//每一项选择绑定事件
            selectObj.settings.child.off("click").on('click', function () {
                var $item = $(this);
                //console.log($item.prop("checked"));
                if ($item.prop("checked")) {
                    $item.addClass("checked");
                } else {
                    $item.removeClass("checked");
                }
                var isCheckAll = selectObj.isCheckAll();
                //console.log(isCheckAll);
                if (isCheckAll) {//全选
                    $selectAllEle.prop("checked", true);
                } else {//全不选
                    $selectAllEle.prop("checked", false);
                }
                selectObj.settings.itemCallback(isCheckAll);//true:全选，false:全不选
            });
        }
    };
    selectObj.settings = jQuery.extend({}, selectObj.settings, options);
    selectObj.selectClick();
    selectObj.itemClick();
};
//步骤提示初始化
jQuery.fn.stepInit = function (options) {
    var $step = this;
    options = $.extend({
        step: 0, //第几步 0:第一步
        part:false,//是否把文字和横线分解【文字一步，横线一步】
        finish:false,//当前步骤时，是否文字和横线都完成
        data: ['步骤一', '步骤二', '步骤三']
    }, options || {});
    $step.empty();//清空
    var span = "";
    //console.log(options);
    for (var i = 0; i < options.data.length; i++) {
        if (i == options.step) {
            if(options.part&&options.finish==false){
                span += '<span class="current"><i>' + (i + 1) + '</i>' + options.data[i] + '</span>'
            }else{
                span += '<span class="current finish"><i>' + (i + 1) + '</i>' + options.data[i] + '</span>'
            }
        }else if(i < options.step){
            span += '<span class="current finish"><i>' + (i + 1) + '</i>' + options.data[i] + '</span>'
        }else {
            span += '<span><i>' + (i + 1) + '</i>' + options.data[i] + '</span>'
        }
    }
    $step.html(span);

};
//店铺分类
jQuery.fn.shopListInit = function (callback) {// 数据获取、显示
    var shopEle = this;
    var shopObj = {
        getSellercatList: function () {//得到店铺分类的元素
            var sellercats = sessionStorage.sellercats;
            if (sellercats == null) {
                $.ajaxByGet('/web/cuxiao/getsellercatlist', null, function (data) {
                    sessionStorage.sellercats = JSON.stringify(data['data']['list']);
                    shopObj.showShopClassify(data['data']['list']);
                });
            } else {
                sellercats = JSON.parse(sellercats);
                shopObj.showShopClassify(sellercats);
            }
            if (callback) {
                callback();
            }
        },
        showShopClassify: function (list) {//显示店铺分类数据
            var html = '<option value="">按店铺分类筛选</option>';
            for (var i = 0; i < list.length; i++) {
                var id = list[i]['id'];         //对应id
                var name = list[i]['name'];     //对于名称
                var pid = list[i]['pid'];       //对应父节点名称
                if (pid != 0) {
                    name = "|&nbsp;&nbsp;&nbsp;&nbsp;" + name;
                }
                html += '<option value="' + id + '">' + name + '</option>';
            }
            $(shopEle).empty().append(html).select2({
                minimumResultsForSearch: Infinity,
                maximumSelectionSize: 5, // 限制数量
            });
        }
    };
    shopObj.getSellercatList();
};
jQuery.fn.tabsMenu = function (options) {//.tabs-menu
    var $tabsMenu = this;
    options = $.extend({
        tabEle: '.btn', //切换内容的按钮
        activeClass: 'active'
    }, options || {});
    var tabsBtn = $tabsMenu.find(options.tabEle);//切换按钮
    tabsBtn.on("click", function () {
        var $tab = $(this), value = $tab.data("value"), $tabMenu = $tab.parents('.tabs-menu');
        tabsBtn.removeClass(options.activeClass);
        $tab.addClass(options.activeClass);
        var $tabCon = $tabMenu.next(".tab-content");
        //console.log($tabCon);
        //console.log($tabCon.find('.tab-pane').length);
        var $tabsPane = $tabCon.find('.tab-pane');
        $tabsPane.each(function () {
            var $pane = $(this);
            if (value == $pane.data('value')) {
                $tabsPane.removeClass(options.activeClass);
                $pane.addClass(options.activeClass);
            }
        });
    });
    return $tabsMenu;
};
//初始化时，根据现有的不同状态切换内容
jQuery.fn.conToggle = function (options) {//.tabs-menu
    var $content_default = this;//默认显示的内容
    options = $.extend({
        content: "", //进行切换的内容
        isToggle:false, //是否切换，默认false【true:取代默认内容，false:依旧显示默认内容】
        showClass: "show"//隐藏的class 类
    }, options || {});
    var $content = $(options.content);
    if(options.isToggle){//取代默认
        $content_default.removeClass(options.showClass);
        $content.addClass(options.showClass);
    }else{
        $content_default.addClass(options.showClass);
        $content.removeClass(options.showClass);
    }
};
//单击时，根据现有的不同状态切换内容
jQuery.fn.toggleClick = function (options) {//.tabs-menu
    var $this = this;//默认显示的内容
    options = $.extend({
        content: "", //进行切换的内容
        data:"value", //通过data-××值来切换判断
        activeClass:"active",
        currentData:"",//data-xx的当前值
        callback: function(value){//
            console.log(value+"click以后的回调事件");
        }
    }, options || {});
    //console.log(options.currentData);
    //根据默认值 初始化 内容切换
    function toggle($ele){
        var d = $ele.data(options.data);
        if(d == options.currentData){
            $ele.addClass(options.activeClass);
        }else{
            $ele.removeClass(options.activeClass);
        }
    }
    function set(){
        $this.each(function(){
            toggle($(this));
        });
        if(options.content){
            var $content = $(options.content);
            $content.each(function () {
                toggle($(this));
            });
        }
        if (options.callback) {
            //console.log(options.currentData);
            options.callback(options.currentData.toString());
        }
    }
    set();
    $this.off("click").on("click",function(){
        var $current = $(this);
        options.currentData = $current.data(options.data);
        set();
    });
};

//添加错误信息
jQuery.fn.dealErrorMsg = function (options) {
    var $this = this;//默认显示的内容
    options = $.extend({
        msg:"",
        errorBox:".form-group",
        otherClass: ""//错误提示的其它样式
    }, options || {});
    var $errorBox = $this.parents(options.errorBox);
    if (options.msg == "") {//正确
        $errorBox.removeClass("has-error");
        $errorBox.find(".error").remove();
    } else {//错误
        $errorBox.addClass("has-error");
        if ($errorBox.find("span").hasClass("error")) {
            $errorBox.find(".error").html("<i class='iconfont icon-timescircle'></i>"+options.msg);
        }else{
            $errorBox.append("<span class='error " + options.otherClass + "'><i class='iconfont icon-timescircle'></i>" + options.msg + "</span>");
        }
    }
};
(function (w, $) {
    //扩展常用的方法
    var home = {
        init: function () {
            //window.LayerInit.init();
            //$.templateInit();
            home.navDeal();
            //$.tooltip();
            //home.exitLogin();
            //home.fixedAsideBind();
        },
        fixedAsideBind: function () {//右侧导航条辅助操作
            var linkEle = $(".fixed-aside").find('li');
            linkEle.on('mouseenter', function () {

                $(this).find(".tip").html($(this).attr("data-title")).end().addClass("hover");
            });
            linkEle.on('mouseleave', function () {
                $(this).removeClass("hover").find(".tip").html("");
            });
        },
        navDeal: function () {//处理主菜单的导航
            var pageData = ["", "", "", "agentorder"];
            var path = window.location.pathname, index = 0;
            //console.log(path.match(/\/agentorder\//gi));
            if (path.match(/agentorder/gi)!=null) {//一键下单
                index = 3;
            } else if (path.match(/stocksyn/gi)!=null) {//一键库存同步
                index = 2;
            } else if (path.match(/\/home\//gi) != null) {//首页
                index = 0;
            } else {//一键铺货
                index = 1;
            }
            $("#mainNav").find("li").each(function(){
                //console.log($(this).index());
                var $li = $(this), indexLi = $li.index();
                if (indexLi == index) {
                    if (!$li.hasClass("active")) {//如何依旧是当前的导航项，就不切换
                        $li.addClass("active");
                    }
                }else{
                    $li.removeClass("active");
                }
            });
        },
        exitLogin: function () {//退出事件,购买事件
            $("#exitLogin").on("click", function () {
                window.location.href = "/account/SignOut";
            });
        }
    };
    $(function () {
        LayerInit.init();
        home.init();
    });
})(window, jQuery);
/*---------jquery 方法扩展 end ------*/