/*
Date: 2017-04-11
 */
/**
 * This jQuery plugin displays pagination links inside the selected elements.
 * @author Gabriel Birke (birke *at* d-scribe *dot* de)
 * @version 1.2
 * @param {int} maxentries Number of entries to paginate
 * @param {Object} opts Several options (see README for documentation)
 * @return {Object} jQuery Object
 */

jQuery.fn.pagination = function (maxentries, opts) {
    //默认没有首尾页和跳转
    opts = jQuery.extend({
        items_per_page: 10, //每页数量
        num_display_entries: 10, //主体页数
        current_page: 0,         //当前第几页
        num_edge_entries: 0,     //边缘页数
        link_to: "javascript:",
        first_text: "",//首页
        last_text: "",//尾页
        link_has_button: false, //是否可以 跳转页数
        button_error_callback:function(){//跳转页不存在时的回调
            alert("当前页不存在");
        },
        pager:true,//基本分页：true存在，false不存在
        pager_other:"",//是否有另一个 上一页，下一页的联动
        prev_text: "Prev",
        next_text: "Next",
        ellipse_text: "...",
        //load_first_page: true,   //是否加载第一页
        prev_show_always: true,
        next_show_always: true,
        callback: function () { return false; }
    }, opts || {});

    return this.each(function () {
        /**
         * 计算最大分页显示数目
         */
        function numPages() {
            return Math.ceil(maxentries / opts.items_per_page);
        }
        /**
         * 极端分页的起始和结束点，这取决于current_page 和 num_display_entries.
         * @返回 {数组(Array)}
         */
        function getInterval() {
            var ne_half = Math.ceil(opts.num_display_entries / 2);
            var np = numPages();
            var upper_limit = np - opts.num_display_entries;
            var start = current_page > ne_half ? Math.max(Math.min(current_page - ne_half, upper_limit), 0) : 0;
            var end = current_page > ne_half ? Math.min(current_page + ne_half, np) : Math.min(opts.num_display_entries, np);
            return [start, end];
        }

        /**
         * 分页链接事件处理函数
         * @参数 {int} page_id 为新页码
         */
        function pageSelected(page_id, evt) {
            current_page = page_id;
            drawLinks();
            var continuePropagation = opts.callback(page_id, panel);
            if (!continuePropagation) {
                if (evt.stopPropagation) {
                    evt.stopPropagation();
                }
                else {
                    evt.cancelBubble = true;
                }
            }
            return continuePropagation;
        }

        /**
         * 此函数将分页链接插入到容器元素中
         */
        function drawLinks() {
            panel.empty();
            var interval = getInterval();
            var np = numPages();
            // 这个辅助函数返回一个处理函数调用有着正确page_id的pageSelected。
            var getClickHandler = function (page_id) {
                return function (evt) { return pageSelected(page_id, evt); }
            };
            if(opts.pager){
                //辅助函数用来产生一个单链接(如果不是当前页则产生span标签)
                var appendItem = function (page_id, appendopts) {
                    page_id = page_id < 0 ? 0 : (page_id < np ? page_id : np - 1); // 规范page id值
                    appendopts = jQuery.extend({ text: page_id + 1, classes: "" }, appendopts || {});
                    var lnk = "";
                    if (page_id == current_page) {
                        lnk = jQuery("<span class='current'>" + (appendopts.text) + "</span>");
                    } else {
                        lnk = jQuery("<a>" + (appendopts.text) + "</a>")
                            .bind("click", getClickHandler(page_id))
                            .attr('href', "javascript:");
                    }
                    if (appendopts.classes) { lnk.addClass(appendopts.classes); }
                    panel.append(lnk);
                };
                /*update*/
                // firstPage 跳转到首页
                if (opts.first_text && (current_page > 0 || opts.prev_show_always)) {
                    appendItem(0, { text: opts.first_text, classes: "prev disabled first" });
                }
                /*update end*/
                // 产生"Previous"---------------------上一页-链接
                if (opts.prev_text && (current_page > 0 || opts.prev_show_always)) {
                    appendItem(current_page - 1, { text: opts.prev_text, classes: "prev" });
                }
                // 产生起始点
                if (interval[0] > 0 && opts.num_edge_entries > 0) {
                    var end = Math.min(opts.num_edge_entries, interval[0]);
                    for (var i = 0; i < end; i++) {
                        appendItem(i);
                    }
                    if (opts.num_edge_entries < interval[0] && opts.ellipse_text) {
                        jQuery("<span>" + opts.ellipse_text + "</span>").appendTo(panel);
                    }
                }
                // 产生内部的些链接
                for (var i = interval[0]; i < interval[1]; i++) {
                    appendItem(i);
                }
                // 产生结束点
                if (interval[1] < np && opts.num_edge_entries > 0) {
                    if (np - opts.num_edge_entries > interval[1] && opts.ellipse_text) {
                        jQuery("<span>" + opts.ellipse_text + "</span>").appendTo(panel);
                    }
                    var begin = Math.max(np - opts.num_edge_entries, interval[1]);
                    for (var i = begin; i < np; i++) {
                        appendItem(i);
                    }

                }
                // 产生 "Next"-链接 ------------------下一页
                if (opts.next_text && (current_page < np - 1 || opts.next_show_always)) {
                    appendItem(current_page + 1, { text: opts.next_text, classes: "next" });
                }
                /*update*/
                // lastPage 跳转到尾页
                if (opts.last_text && (current_page < np - 1 || opts.next_show_always)) {
                    appendItem(np, { text: opts.last_text, classes: "prev disabled last" });
                }
                /****************** Added ***************/
                /*插入一个文本框，用户输入并回车后进行跳转*/
                if (opts.link_has_button) {
                    var pageText = '<input id="pagevalue" class="page-input" size="1" value="' + (current_page + 1) + '"type="text">';
                    var toPage = '<a id="searchPage" href="javascript:void(0);">跳转</a>';
                    $(pageText).appendTo(panel);
                    $(toPage).appendTo(panel);
                    var $sp = $("#searchPage");
                    $sp.on('keyup', function (event) {
                        var $this = $(this);
                        $this.val($this.val().trim().replace(/[^\d]/g, ''));
                    });
                    $sp.on("click", function (evt) {
                        var pageVal = parseInt($.trim($("#pagevalue").val()));
                        var iPageNum = pageVal - 1;
                        if (iPageNum < np) { pageSelected(iPageNum, evt); } else {
                            opts.button_error_callback(pageVal);
                        }
                    });
                }
            }
            /*插入另一个联动的分页，用户输入*/
            if(opts.pager_other != ""){
                var $pagerOther = $(opts.pager_other);
                $pagerOther.empty();
                //辅助函数用来产生一个单链接(如果不是当前页则产生span标签)
                var appendItemOther = function (page_id, appendopts) {
                    page_id = page_id < 0 ? 0 : (page_id < np ? page_id : np - 1); // 规范page id值
                    appendopts = jQuery.extend({ text: page_id + 1, classes: "" }, appendopts || {});
                    var lnk = "";
                    if (page_id == current_page) {
                        lnk = jQuery("<span class='current'>" + (appendopts.text) + "</span>");
                    } else {
                        lnk = jQuery("<a>" + (appendopts.text) + "</a>")
                            .bind("click", getClickHandler(page_id))
                            .attr('href', "javascript:");
                    }
                    if (appendopts.classes) { lnk.addClass(appendopts.classes); }
                    $pagerOther.append(lnk);
                };
                // 产生"Previous"---------------------上一页-链接
                if (current_page > 0 || opts.prev_show_always) {
                    appendItemOther(current_page - 1, { text:"<", classes: "prev" });
                }
                var pagetext = '<input class="page-input" size="1" value="' + (current_page + 1)+"/"+ np + '"type="text">';
                $(pagetext).appendTo($pagerOther);
                // 产生"next"---------------------下一页-链接
                if (current_page < np - 1 || opts.next_show_always) {
                    appendItemOther(current_page + 1, { text: ">", classes: "next" });
                }
            }
            /****************** Added End ******************/
            /*update end*/
        }

        //从选项中提取current_page
        var current_page = opts.current_page;
        //创建一个显示条数和每页显示条数值
        maxentries = (!maxentries || maxentries < 0) ? 1 : maxentries;
        opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0) ? 1 : opts.items_per_page;
        //存储DOM元素，以方便从所有的内部结构中获取
        var panel = jQuery(this);
        // 获得附加功能的元素
        this.selectPage = function (page_id) { pageSelected(page_id); };
        this.prevPage = function () {
            if (current_page > 0) {
                pageSelected(current_page - 1);
                return true;
            }
            else {
                return false;
            }
        };
        this.nextPage = function () {
            if (current_page < numPages() - 1) {
                pageSelected(current_page + 1);
                return true;
            }
            else {
                return false;
            }
        };
        // 所有初始化完成，绘制链接
        drawLinks();
        //if (!opts.load_first_page && opts.current_page == 0) {
        //    opts.load_first_page = true;
        //    return;
        //}
        //// 回调函数
        //opts.callback(current_page, this);
    });
};