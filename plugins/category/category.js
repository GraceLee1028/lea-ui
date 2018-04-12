/**
 * Created by lifeng on 2017/11/27.
 */
/**
 * Created by lea on 2017/11/27.
 */

(function () {
    var cc_list = ".cate-list", cc_result = ".cate-result", cc_wrap = ".cate-wrap", _category = ".category", cate_nochild = ".category.not-child", _tree = '.cate-tree', li_tree = '.cate-tree li';
    var hasSelectFinish = false;//类目是否选择完成
    var nextCateData = {};
    var shopId;
    var cate = {
        getHeaderHtml: function (data) {
            var html = '<div class="cate-header">' +
                '<div class="form-group form-group-sm" id="shopTitle">' +
                    '<label>当前商品：</label><span class="shop-text">小个子福克斯经典复刻垃圾的空间发啦</span>' +
                '</div>';
            if (data.type == 1) {
                html += '<div class="form-group form-group-sm category-search">' +
                    '<label>类目搜索：</label>' +
                    '<div class="input-group">' +
                        '<input id="sortWord" type="text" class="form-control" placeholder="请输入类目关键词">' +
                        '<button type="button" id="cate-search" class="btn leaui-btn-info">快速找到类目</button>' +
                    '</div>' +
                '</div>' +
            '</div>';
            } else if (data.type == 2) {//拼多多
                html += '<div class="form-group form-group-sm">' +
                    '<label>阿里类目：</label><span class="ali-cate">' + data.aliCateName + '</span>' +
                '</div>' +
            '</div>';
            }
            return html;
        },
        getContainerHtml: function (type) {//添加包裹类目的容器
            var html = '<div class="cate-container">' +
                '<div class="cate-list"></div>';
            if (type == 1) {
                html += '<div class="cate-result"></div>';
            } else if (type == 2) {//拼多多
                html += "";
            }
            html += '</div>' +
            '<div class="cate-footer">' +
                '您当前选择的分类目录是：<span id="sortName">无</span>' +
            '</div>';
            return html;
        },
        getCategory: function (type) {//获取第一级目录
            if (type == 1) {//1688 第一级类目为父子类目
                if (localStorage.category && localStorage.category != "null") {//存在，获取缓存
                    var html = cate.getWrapHtml(JSON.parse(localStorage.category), false, 0);
                    $(cc_list).html(html);
                } else {
                    $.ajaxByGet("/api/PuhuoApi/GetSortList", { "shopId": shopId, "parentId": 0 }, function (data) {
                        var d = data["data"];
                        localStorage.category = JSON.stringify(d);
                        $(cc_list).html(cate.getWrapHtml(d, false, 0));
                    }, true);
                }
            } else if (type == 2) {//拼多多【第一级类目不是父子类目】[数据存在问题，测试获取级别为2的数据]
                if (localStorage.categoryPin5 && localStorage.categoryPin5 != "null") {//存在，获取缓存
                    var html = cate.getPddWrapHtml(JSON.parse(localStorage.categoryPin), true, 0);
                    $(cc_list).html(html);
                } else {
                    //获取类目的接口【拼多多的接口】
                    $.ajaxByGet("/api/PuhuoToPddApi/GetShopSort", { "shopId": shopId, "parentId": 0 }, function (data) {
                        var d = data["data"];
                        localStorage.categoryPin4 = JSON.stringify(d);
                        $(cc_list).html(cate.getPddWrapHtml(d, true, 0));
                    }, true);
                }
            }
            
        },
        getPddWrapHtml: function (data, isChild, level) {//拼多多，只有子类目
            var html = '<div class="cate-wrap" data-level="' + level + '">';
            console.log(html);
            if (data.length != 0) {
                html += '<div class="cate-research">' +
                '<i class="iconfont icon-sousuo"></i>' +
                '<input type="text" class="cc-search" placeholder="输入名称" />' +
                '</div>';
            } else {
                html += '<div class="cate-tip">该类目下暂无下级类目</div>';
            }
            var child = "";
            if (data.length > 0) {
                var child = '<div class="cate-content"><div class="cate-tree"><ul>';
                for (var i = 0, len = data.length; i < len; i++) {//拼多多的数据
                    var list = data[i];
                    if (list["level"] == 3) {//最后一级
                        child += '<li class="show" data-id="' + list["catId"] + '">' + list["catName"] + '</li>';
                    } else {
                        child += '<li class="show children" data-id=' + list["catId"] + '>' + list["catName"] + '</li>';
                    }
                }
                 child += '</ul></div></div>';
            } else {
                return "";
            }
            return html + child + '</div>';
        },
        getWrapHtml: function (data, isChild, level) {//父类目+子类目【isChild:true;只有子类目】
            var html = '<div class="cate-wrap" data-level="' + level + '">';
            if (data.length != 0) {
                html += '<div class="cate-research">' +
                '<i class="iconfont icon-sousuo"></i>' +
                '<input type="text" class="cc-search" placeholder="输入名称" />' +
                '</div>';
            } else {
                html += '<div class="cate-tip">该类目下暂无下级类目</div>';
            }
            var child = "";
            if (isChild) {
                child += cate.getChildHtml(data);
            } else {//父类目+子类目
                child = '<div class="cate-content"><ul class="cate-ul">';
                for (var i = 0, len = data.length; i < len; i++) {
                    var key = data[i]["key"], list = data[i]["value"];
                    if (key["isLast"] == 1 || list.length == 0) {//无子集
                        child += '<li class="category not-child">';
                    } else {//有子集
                        child += '<li class="category children">';
                    }
                    child += '<p data-id="' + key["sortId"] + '" class="cate-text"><span>' + key["Sortname"] + '</span><i class="iconfont icon-xiajiantou"></i></p>';
                    child += cate.getChildHtml(list);
                    child += '</li>';
                    if (i == length - 1) {
                        child += '</ul></div>';
                    }
                }
            }
            return html + child + '</div>';
        },
        getChildHtml: function (data) {//类目【子类目】
            if (data.length > 0) {
                var child = '<div class="cate-content"><div class="cate-tree"><ul>';
                for (var i = 0, len = data.length; i < len; i++) {
                    var list = data[i];
                    if (list["isLast"] == 1) {//无子集
                        child += '<li class="show" data-id="' + list["sortId"] + '">' + list["sortName"] + '</li>';
                    } else {
                        child += '<li class="show children" data-id=' + list["sortId"] + '>' + list["sortName"] + '</li>';
                    }
                }
                return child + '</ul></div></div>';
            } else {
                return "";
            }
        },
        /***
            id: 选中的类目id
            level:搜索的类目级别【0：表示第一级】
            type:1:1688；2：拼多多
        */
        getNextCategory: function (id, level,type) {//选中类目后获取下一级类目列表
            var dealCate = function (d) {
                $(cc_list).find(cc_wrap).each(function () {
                    var $wrap = $(this);
                    if ($wrap.index() > level) {
                        $wrap.remove();
                    }
                });
                if (level < 2) {
                    var html = "";
                    if (type == 2) {//拼多多
                        html = cate.getPddWrapHtml(d, true, level + 1);
                    } else {
                        html = cate.getWrapHtml(d, true, level + 1);
                    }
                    $(cc_list).append(html);
                }
            };
            if (nextCateData && nextCateData[id]) {//之前选择过就直接记录
                dealCate(nextCateData[id]);
            } else {
                //获取下一级的类目接口
                if (type == 1) {
                    $.ajaxByGet("/api/PuhuoApi/GetCategory", { id: id }, function (data) {
                        var d = data.data;
                        nextCateData[id] = d;
                        dealCate(d);
                    }, true);
                } else {//拼多多
                    if (level < 2) {
                        $.ajaxByGet("/api/PuhuoToPddApi/GetShopSort", { "shopId": shopId, "parentId": id }, function (data) {
                            var d = data["data"];
                            nextCateData[id] = d;
                            dealCate(d);
                        }, true);
                    }
                }
                
            }
        },
        researchCate: function () {//类目搜索
            $(cc_list).on("keyup", ".cc-search", function () {
                var $search = $(this), val = $search.val().trim(), $wrap = $search.parents(cc_wrap), $tree = $wrap.find(_tree);
                var filter = function (html) {
                    if (val == "" || html.match(val) != null) {
                        return true;
                    } else {
                        return false;
                    }
                };
                $search.parents(".cate-content").scrollTop(0);
                $wrap.find(_category + ".children ").removeClass("active");
                //显示和隐藏子类目
                $wrap.find(li_tree).each(function () {
                    var $li = $(this), html = $li.html();
                    if (filter(html)) {//匹配
                        $li.addClass("show");
                    } else {
                        $li.removeClass("show");
                    }
                });
                //处理父类目
                $tree.each(function () {
                    var $category = $(this).parents(_category);
                    if ($(this).find("li.show").length == 0) {
                        $category.hide();
                    } else {
                        $category.show();
                    }
                });
                $wrap.find(cate_nochild).each(function () {
                    var $txt = $(this).find(".cate-text>span"), html = $txt.html();
                    if (filter(html)) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });
        },
        fastFindCate: function (type) {//快速找到类目
            $("#cate-search").on("click", function () {
                var $search = $(this), value = $("#sortWord").val().trim();
                if (value != "") {
                    $.ajaxByGet("/api/PuhuoApi/SearchSort", { "keyWord": value }, function (data) {
                        var d = data.data, html = "";
                        if (d.length == 0) {
                            html = "没有找到关键字为‘" + value + "’的类目";
                        } else {
                            html = '<div class="cate-tree"><ul>';
                            for (var i = 0, len = d.length; i < len; i++) {
                                var list = d[i];
                                html += '<li class="show" data-name="' + list["sortName"] + '"  data-path="' + list["path"] + '" data-id="' + list["sortId"] + '" >' + list["path"] + '>' + list["sortName"] + '</li>';
                            }
                            html += "</ul></div>";
                        }
                        $(cc_list).hide();
                        $(cc_result).html(html).show();
                        console.log(data);
                    }, true);
                } else {
                    //添加第一级类目内容
                    cate.getCategory(type);
                    $(cc_result).hide();
                    $(cc_list).show();
                }
            });
        },
        categoryClick: function (type) {//类目中的事件处理
            //类目伸缩及部分类目选择
            $(cc_list).on("click", ".cate-text", function () {//父类目
                var $this = $(this), $tree = $this.next(_tree); $category = $this.parents(_category);
                if ($category.hasClass("children")) {//存在子选项
                    if ($category.hasClass("active")) {//收缩
                        $category.addClass("opening");
                        $tree.css("height", "0px");
                        setTimeout(function () {
                            $category.removeClass("opening");
                            $category.removeClass("active");
                        }, 200);
                    } else {//展开
                        $category.addClass("active");
                        $tree.css("height", "0px");
                        $category.addClass("opening");
                        var h = $tree.find("ul").height();
                        $tree.css("height", h);
                        setTimeout(function () {
                            $category.removeClass("opening");
                        }, 400);
                    }
                } else {//不存在子选项
                    $category.addClass("active");
                    $(li_tree).removeClass("active");//取消其它类目选择

                    cate.getNextCategory($this.data("id"), 0,type);
                    hasSelectFinish = true;
                }
            });
            //类目选择[只有子类目处理]
            $(cc_list).on("click", li_tree, function () {//子类目
                var $this = $(this), $wrap = $this.parents(cc_wrap),
                    $li_tree = $wrap.find(li_tree), $cate_nochild = $wrap.find(cate_nochild);
                $li_tree.removeClass("active");
                $cate_nochild.removeClass("active");
                $this.addClass("active");
                var sordId = $this.data("id");
                var id = "", name = "无";
                cate.getNextCategory(sordId, $this.parents(cc_wrap).data("level"),type);
                if ($this.hasClass("children")) {//存在子选项
                    hasSelectFinish = false;
                } else {//不存在子选项
                    id = sordId;
                    name = $this.html();
                    hasSelectFinish = true;
                }
                cate.setSortId({ id: id, name: name }, hasSelectFinish);
            });
            //类目搜索结果处理
            $(cc_result).on("click", li_tree, function () {
                var $li_tree = $(cc_result).find(li_tree), $li = $(this);
                $li_tree.removeClass("active");
                $li.addClass("active");
                var id = $li.data("id"), name = $li.data("name");
                hasSelectFinish = true;
                cate.setSortId({ id: id, name: name }, hasSelectFinish);
            });
        },
        setSortId: function (data, isFinish) {
            var $sort = $("#sortName");
            $sort.data("id", data.id);
            $sort.data("name", data.name);
            $sort.html(data.name);
            $sort.data("ok", isFinish == true ? 1 : 0);//ok:0:未选择，1：选择完成
        }
    };
    $.fn.category = function (options) {
        options = $.extend({
            shopTitle: "", //当前商品标题
            shopId: "11102",//店铺id
            aliCateName:"",//阿里的类目
            type:2 //1：之前阿里的，2:表示拼多多
        }, options || {});
        var $categoryBox = this;
        shopId = options.shopId;
        var html = cate.getHeaderHtml({
            type: options.type,
            aliCateName: options.aliCateName
        }) + cate.getContainerHtml(options.type);
        //添加容器
        $categoryBox.html(html);
        if (options.type == 1) {//存在快速找到类目的搜索功能
            //快速找到目录
            cate.fastFindCate(options.type);
        }
        //添加第一级类目内容
        cate.getCategory(options.type);
        //类目中的类目的搜索
        cate.researchCate();
        //类目中的事件 依赖绑定
        cate.categoryClick(options.type);
    };
})();