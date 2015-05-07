define(function(require, exports, module) {
	var win = window,
		doc = win.document,
		urls = require("interface"),
		magazine = function(ops) {
			/* magazine */
			return new magazine.fn.init(ops);
		};
	magazine.fn = magazine.prototype = {
		init: function(ops) {
			jQuery.extend(this, ops);
			var self = this;
			self.getMagazineItems(function(html) {
				jQuery(self.list).html(html);
			});
			return this;
		}
	};
	magazine.fn.init.prototype = magazine.fn;
	/* searchbox */
	var searchbox = function(ops) {
		return new searchbox.fn.init(ops);
	};
	searchbox.fn = searchbox.prototype = {
		init: function(ops) {
			jQuery.extend(this, ops);
			var self = this;
			self.inputbox = jQuery(self.input);
			self.inputbox.on("keyup", function(e) {
				var keysJson;
				//console.log(e.keyCode)
				var val = jQuery.trim(jQuery(this).val() || ""),
					defKey = jQuery.trim(jQuery(self.input).attr("data-deftext") || "");
				//if (val != "" && val != defKey) keysJson = searchbox.lenovo(val);
				//console.log(val);
				//console.log(keysJson);
			}).click(function(e) {
				var def = jQuery(this).attr("data-deftext"),
					val = jQuery(this).val();
				if (val == def) jQuery(this).val("").removeClass("color_gray");
			}).blur(function(e) {
				var def = jQuery(this).attr("data-deftext"),
					val = jQuery(this).val();
				if (jQuery.trim(val) == "") jQuery(this).val(def).addClass("color_gray");
			});
			self.form = jQuery(self.dom);
			self.form.on("submit", function(e) {
				e.preventDefault();
				if (self.verificat()) self.send();
			});
			self.submitButton = jQuery(self.submit);
			self.submitButton.on("click", function(e) {
				e.preventDefault();
				if (self.verificat()) self.send();
			});
			self.getHotword(self.inputbox);
			self.getKeyItems(function(html) {
				jQuery(self.keybox).html(html);
			});
			return this;
		},
		verificat: function() {
			var self = this;
			var keys = jQuery.trim(self.inputbox.val() || ""),
				defKey = jQuery.trim(self.inputbox.attr("data-deftext") || "");
			if (keys == "") {
				alert("输入内容不能为空，请重新输入！");
				return false;
			} else if (keys.getLength(true) < 2) {
				alert("请正确输入关键词！");
				return false;
			}
			self.datas = {
				key: encodeURIComponent(keys)
			};
			return true;
		},
		send: function() {
			var self = this;
			self.form[0].submit();
			/*location.href = siteHost.search + self.form.attr("action") + "?" + self.inputbox.attr("name") + "=" + encodeURIComponent(self.inputbox.val()) + "&r=search&p=1";
			console.log("send")*/
			//ajax();
		}
	};
	searchbox.lenovo = function(key) {
		//ajax();
		return [];
	};
	searchbox.fn.init.prototype = searchbox.fn;

	/* slidebanner */
	var slideAd = function(ops) {
		return new slideAd.fn.init(ops);
	};
	slideAd.fn = slideAd.prototype = {
		init: function(ops) {
			var self = this;
			jQuery.extend(self, ops);
			self.getBannerItem(self, function() {
				self.refresh().eventInit();
				jQuery(window).on("resize", function() {
					self.refresh();
				});
			});
			return this;
		},
		eventInit: function() {
			var self = this;
			jQuery(self.list + " a").hover(function() {
				var index = jQuery(this).index();
				self.activeIndex = index;
				if (self.SwitchTime) clearTimeout(self.SwitchTime);
				self.SwitchTime = setTimeout(function() {
					self.stop().Switch(index);
				}, self.waitTime);
			}, function() {
				self.stop(false).play(self.activeIndex);
			});
			return this;
		},
		refresh: function() {
			var self = this;
			self.items = jQuery(self.view + " div");
			self.itemWidth = jQuery(window).width();
			self.itemHeight = self.items.eq(0).height();
			jQuery(self.view + " div").css({
				position: "absolute"
			}).each(function(i, elem) {
				var img = jQuery("img", this),
					src = img.attr("src");
				img.hide();
				jQuery(this).css({
					opacity: 0,
					top: 0,
					left: 0, //self.itemWidth * i,
					background: "#fff url(" + src + ") no-repeat top center",
					width: jQuery(this).parent().width(), //self.itemWidth,
					height: self.itemHeight,
					display: "block"
				});
			});
			jQuery(self.list).stop().animate({
				right: jQuery(win).width() < 1200 ? "0" : "112px"
			});
			self.play(0);
			return this;
		},
		play: function(index) {
			var self = this;
			if (self.playTimeout) clearTimeout(self.playTimeout);
			self.playTimeout = setTimeout(function() {
				self.Switch(index, function() {
					if (!self.isPause) {
						index = index++ >= self.items.length ? 0 : index++;
						self.play(index);
					}
				});
			}, self.intervalTime);
			return this;
		},
		stop: function(bool) {
			var self = this;
			if (self.playTimeout) clearTimeout(self.playTimeout);
			self.isPause = typeof bool != "undefined" ? bool : true;
			return this;
		},
		Switch: function(index, callback) {
			var self = this;
			self.activeIndex = index;
			jQuery.when(self.items.eq(index).siblings().css({
				zIndex: 1,
				left: 0
			}).animate({
				opacity: 0
			}, self.time), self.items.eq(index).css({
				left: 0,
				zIndex: 2
			}).animate({
				opacity: 1
			}, self.time)).done(function() {
				if (callback) callback();
			});
			return this;
		},
		next: function() {
			var index = self.activeIndex + 1 > self.items.length ? 0 : self.activeIndex + 1;
			this.play(index);
			return this;
		},
		prev: function() {
			var index = self.activeIndex - 1 < 0 ? 0 : self.activeIndex - 1;
			this.play(index);
			return this;
		}
	};
	slideAd.fn.init.prototype = slideAd.fn;

	/* waterfall */
	var setting = {
			column_width: 204, //列宽
			column_className: 'waterfall_column', //列的类名
			column_space: 10, //列间距
			cell_selector: '.cell', //要排列的砖块的选择器，context为整个外部容器
			img_selector: 'img', //要加载的图片的选择器
			auto_imgHeight: true, //是否需要自动计算图片的高度
			fadein: true, //是否渐显载入
			fadein_speed: 600, //渐显速率，单位毫秒
			insert_type: 1, //单元格插入方式，1为插入最短那列，2为按序轮流插入
			getColumnItems: function(index) {}, //获取动态资源函数,必须返回一个砖块元素集合,传入参数为加载的次数
			onRefresh: function() {}, //重排后重置
			getNavItems: function(type, eventFunc) {}, //获取导航内元素
			createColumn: function(data, column_num) {} //创建列中单元
		},
		waterfall = $.waterfall = {}, //对外信息对象
		$container = null; //容器
	waterfall.load_index = 0, //加载次数
	$.fn.extend({
		waterfall: function(opt) {
			opt = opt || {};
			setting = $.extend(setting, opt);
			$container = waterfall.$container = $(this);
			setting.getNavItems(setting.type, function(dom, callback) {
				public_render(dom, callback);
			}, function(nav) {
				if (nav) {
					var navs = jQuery(setting.nav).html(nav).find("a");
					navs.click(function(e) {
						e.preventDefault();
						var type = jQuery(this).attr("href");
						type = type.replace(siteHost.home + "/", "");
						navs.removeClass("active");
						jQuery(this).addClass("active");
						var channel = jQuery(this).attr("data-parentType");
						jQuery.cookie("channelpath", channel + "_" + type);
						//$container.empty();
						$.waterfall.load_index = -1;
						loadData(type);
						setting.onRefresh();
					});
				}
			});
			if (jQuery(".cell", $container).length == 0 && waterfall.$columns) { //判断容器中是否有ITEM
				loadData(setting.type);
			} else {
				waterfall.$columns = creatColumn();
				render($(this).find(setting.cell_selector).detach(), false); //重排已存在元素时强制不渐显
			}
			waterfall._scrollTimer2 = null;
			$(window).bind('scroll', function() {
				clearTimeout(waterfall._scrollTimer2);
				waterfall._scrollTimer2 = setTimeout(function() {
					onScroll();
					//setting.onRefresh();
				}, 300);
			});
			waterfall._scrollTimer3 = null;
			$(window).bind('resize', function() {
				clearTimeout(waterfall._scrollTimer3);
				waterfall._scrollTimer3 = setTimeout(function() {
					onResize();
					setting.onRefresh();
				}, 300);
			});
		}
	});

	function loadData(type) {
		setting.type = type;
		getElements(type, function(dom, func) {
			waterfall.$container.empty();
			waterfall.$columns.remove();
			waterfall.$columns = creatColumn();
			render(dom, true, func);
			//if (setting.onRefresh) setting.onRefresh();
		});
	}

	function creatColumn() { //创建列
		waterfall.column_num = calculateColumns(); //列数
		var html = setting.createColumn(setting, waterfall.column_num);
		$container.prepend(html); //插入列
		return $('.' + setting.column_className, $container); //列集合
	}

	function calculateColumns() { //计算需要的列数
		var num = Math.floor(($container.innerWidth()) / (setting.column_width + setting.column_space));
		if (num < 1) {
			num = 1;
		} //保证至少有一列
		return num;
	}

	function render(elements, fadein, callback) { //渲染元素
		if (!$(elements).length) return; //没有元素
		var $columns = waterfall.$columns;
		$(elements).each(function(i) {
			if (!setting.auto_imgHeight || setting.insert_type == 2) { //如果给出了图片高度，或者是按顺序插入，则不必等图片加载完就能计算列的高度了
				if (setting.insert_type == 1) {
					insert($(elements).eq(i), setting.fadein && fadein); //插入元素
				} else if (setting.insert_type == 2) {
					insert2($(elements).eq(i), i, setting.fadein && fadein); //插入元素	 
				}
				return true; //continue
			}
			if ($(this)[0].nodeName.toLowerCase() == 'img' || $(this).find(setting.img_selector).length > 0) { //本身是图片或含有图片
				var image = new Image;
				var src = $(this)[0].nodeName.toLowerCase() == 'img' ? $(this).attr('src') : $(this).find(setting.img_selector).attr('src');
				image.onload = function() { //图片加载后才能自动计算出尺寸
					image.onreadystatechange = null;
					if (setting.insert_type == 1) {
						insert($(elements).eq(i), setting.fadein && fadein); //插入元素
					} else if (setting.insert_type == 2) {
						insert2($(elements).eq(i), i, setting.fadein && fadein); //插入元素	 
					}
					image = null;
				}
				image.onreadystatechange = function() { //处理IE等浏览器的缓存问题：图片缓存后不会再触发onload事件
					if (image.readyState == "complete") {
						image.onload = null;
						if (setting.insert_type == 1) {
							insert($(elements).eq(i), setting.fadein && fadein); //插入元素
						} else if (setting.insert_type == 2) {
							insert2($(elements).eq(i), i, setting.fadein && fadein); //插入元素	 
						}
						image = null;
					}
				}
				image.src = src;
			} else { //不用考虑图片加载
				if (setting.insert_type == 1) {
					insert($(elements).eq(i), setting.fadein && fadein); //插入元素
				} else if (setting.insert_type == 2) {
					insert2($(elements).eq(i), i, setting.fadein && fadein); //插入元素	 
				}
			}
		});
		if (callback) callback();
	}

	function public_render(elems, callback) { //ajax得到元素的渲染接口
		render(elems, true, callback);
	}

	function insert($element, fadein) { //把元素插入最短列
		if (fadein) { //渐显
			$element.css("opacity", 0).appendTo(waterfall.$columns.eq(calculateLowest())).animate({
				opacity: 1
			});
		} else { //不渐显
			$element.appendTo(waterfall.$columns.eq(calculateLowest()));
		}
		setting.itemInit($element);
	}

	function insert2($element, i, fadein) { //按序轮流插入元素
		if (fadein) { //渐显
			$element.css("opacity", 0).appendTo(waterfall.$columns.eq(i % waterfall.column_num)).animate({
				opacity: 1
			});
		} else { //不渐显
			$element.appendTo(waterfall.$columns.eq(i % waterfall.column_num));
		}
		setting.itemInit($element);
	}

	function calculateLowest() { //计算最短的那列的索引
		var min = waterfall.$columns.eq(0).outerHeight(),
			min_key = 0;
		waterfall.$columns.each(function(i) {
			if ($(this).outerHeight() < min) {
				min = $(this).outerHeight();
				min_key = i;
			}
		});
		return min_key;
	}

	function getElements(type, callback) { //获取资源
		$.waterfall.load_index++;
		return setting.getColumnItems($.waterfall.load_index, type, callback);
	}
	waterfall._scrollTimer = null; //延迟滚动加载计时器
	function onScroll() { //滚动加载
		clearTimeout(waterfall._scrollTimer);
		waterfall._scrollTimer = setTimeout(function() {
			var $lowest_column = waterfall.$columns.eq(calculateLowest()); //最短列
			var bottom = $lowest_column.offset().top + $lowest_column.outerHeight(); //最短列底部距离浏览器窗口顶部的距离
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0; //滚动条距离
			var windowHeight = document.documentElement.clientHeight || document.body.clientHeight || 0; //窗口高度
			if (scrollTop >= bottom - windowHeight + 100) {
				getElements(setting.type, function(dom, func) {
					render(dom, true, func);
				});
			}
		}, 100);
	}

	function onResize() { //窗口缩放时重新排列
		if (calculateColumns() == waterfall.column_num) return; //列数未改变，不需要重排
		var $cells = waterfall.$container.find(setting.cell_selector);
		waterfall.$columns.remove();
		waterfall.$columns = creatColumn();
		render($cells, false); //重排已有元素时强制不渐显
		//$.waterfall.load_index = -1;
		//loadData(setting.type);
	}
	/* screenEvent */
	var screenEvent = function(ops) {
		return new screenEvent.fn.init(ops);
	};
	screenEvent.fn = screenEvent.prototype = {
		init: function(ops) {
			jQuery.extend(this, ops);
			var self = this,
				ua = window.navigator.userAgent,
				zz = new RegExp("/(" + self.type + ")[ ]((\d+)\.(\d+))/");
			self.browser = /(msie) ((\d+)\.(\d+))/.exec(ua.toLowerCase());
			return this;
		},
		done: function() {
			var self = this;
			if (self.browser && self.browser.length > 0 && self.browser[1] == self.type && self.browser[3] < self.maxVer) {
				if (self.css) jQuery(self.dom).css(self.css);
				var condit = self.condit();
				if (typeof condit == "string") {
					jQuery(self.dom).toggleClass(condit);
				} else {
					jQuery(self.dom).css(condit);
				}
			}
			return this;
		},
		browser: function() {
			return this.browser && this.browser.length > 0 ? {
				type: this.browser[1],
				ver: this.browser[2]
			} : false;
		},
		handle: function(ops) {
			var self = this;
			jQuery.each(ops, function(i, obj) {
				jQuery.each(obj.event, function(name, func) {
					jQuery(obj.dom).on(name, function(e) {
						if (func) func.call(this, e, function() {
							self.done();
						});
					});
				});
			});
			return this;
		}
	};
	screenEvent.fn.init.prototype = screenEvent.fn;
	/* headernav */
	var headernav = function(ops) {
		return new headernav.fn.init(ops);
	};
	headernav.fn = headernav.prototype = {
		init: function(ops) {
			jQuery.extend(this, ops);
			this.assemble();
			return this;
		},
		assemble: function() {
			var self = this;
			headernav.loadData(self.activeItem, function(html, data) {
				if (self.activeItem != "1") {
					jQuery.each(data, function(i, item) {
						if (item.id == self.activeItem) {
							jQuery(function() {
								document.title = item.name;
							});
							return false;
						}
					});
				}
				var temp = jQuery("<div></div>").html(html).hide();
				jQuery(self.dom).html(temp.html());
				temp.remove();
				var items = jQuery(self.dom + " a");
				items.click(function(e) {
					var type = jQuery(this).attr("href").replace(siteHost.home + "/", "");
					e.preventDefault();
					items.removeClass("active");
					jQuery(this).addClass("active");
					location.href = (type == "1" ? siteHost.debug ? "test_index" : "index" : siteHost.debug ? "test_m" : "m") + ".html?t=" + type;
				});
			}, self);
			return this;
		},
		contentRefresh: function(type) {
			var self = this;
			self.activeItem = type;
			self.assemble();
			return this;
		}
	};
	headernav.loadData = function(type, eventFunc, self) {
		if (self.getNavItems) self.getNavItems(type, function(html, data) {
			eventFunc(html, data);
		});
		else
			eventFunc("", []);
		/*var data = [{
			name: "index",
			title: "首页"
		}];
		data = data.concat([{
			name: "jiazhuang",
			title: "家具"
		}, {
			name: "xiangbao",
			title: "箱包"
		}]);*/
		//eventFunc(data);
	};
	headernav.fn.init.prototype = headernav.fn;

	/*
	cookie
	*/
	jQuery.cookie = function(b, j, m) {
		if (typeof j != "undefined") {
			m = m || {};
			if (j === null) {
				j = "";
				m.expires = -1;
			}
			var e = "";
			if (m.expires && (typeof m.expires == "number" || m.expires.toUTCString)) {
				var f;
				if (typeof m.expires == "number") {
					f = new Date();
					f.setTime(f.getTime() + (m.expires * 24 * 60 * 60 * 1000));
				} else {
					f = m.expires;
				}
				e = "; expires=" + f.toUTCString();
			}
			var l = m.path ? "; path=" + m.path : "";
			var g = m.domain ? "; domain=" + m.domain : "";
			var a = m.secure ? "; secure" : "";
			document.cookie = [b, "=", encodeURIComponent(j), e, l, g, a].join("");
		} else {
			var d = null;
			if (document.cookie && document.cookie != "") {
				var k = document.cookie.split(";");
				for (var h = 0; h < k.length; h++) {
					var c = jQuery.trim(k[h]);
					if (c.substring(0, b.length + 1) == (b + "=")) {
						d = decodeURIComponent(c.substring(b.length + 1));
						break;
					}
				}
			}
			return d;
		}
	};

	var scrollExec = function(ops) {
		return scrollExec.fn.init(ops);
	};
	scrollExec.fn = scrollExec.prototype = {
		init: function(ops) {
			jQuery.extend(this, ops);
			if (ops.getElemsOffset) this.getOffset(ops.getElemsOffset);
			return this;
		},
		getOffset: function(func) {
			var self = this;
			self.tops = func();
			scrollExec.initScrollEvent(function(top) {
				self.done(top);
			});
			return this;
		},
		done: function(top) {
			var self = this;
			jQuery.each(self.tops, function(i, offset) {
				if (top + 100 >= offset.top) {
					offset.func();
					self.tops.splice(i, 1);
					return false;
				}
			});
			return this;
		}
	};
	scrollExec.initScrollEvent = function(func) {
		jQuery(window).on("scroll", function() {
			var top = (doc.documentElement.scrollTop || doc.body.scrollTop || 0) + jQuery(win).height();
			func(top);
		});
		jQuery(window).trigger('scroll');
	};
	scrollExec.fn.init.prototype = scrollExec.fn;

	var oldtoTopevent, rightTimeout;
	return {
		magazine: magazine,
		searchbox: searchbox,
		slidebanner: slideAd,
		screenEvent: screenEvent,
		headernav: headernav,
		scrollExec: scrollExec,
		imgbanner: function(ops) {
			ops.getBannerItem(function(data, type) {
				var mod;
				type = parseFloat(type);
				switch (type) {
					case 9:
						mod = [
							[2, 1], 3, [1, 1, 1]
						];
						break;
					case 2:
						mod = [
							[1, 2],
							[2, 1], 3
						];
						break;
					case 11:
					case 8:
					case 7:
						mod = [
							[2, 1],
							[1, 2], 3
						];
						break;
					case 10:
					case 6:
						mod = [
							[2, 1],
							[1, 2],
							[2, 1]
						];
						break;
					case 5:
					case 4:
						mod = [3, [1, 2],
							[2, 1]
						];
						break;
					case 3:
						mod = [
							[2, 1],
							[1, 2],
							[1, 1, 1]
						];
						break;
				}
				var colitems = jQuery("<div></div>"),
					col = 0;
				jQuery.each(["gongge_left", "gongge_midd", "gongge_right"], function(x, colcls) {
					var item = jQuery("<div></div>").addClass(colcls);
					colitems.append(item);
					jQuery.each(mod, function(i, obj) {
						if (typeof obj == "number") {
							var val = data[col];
							if (val) item.append(jQuery("<div></div>").addClass("ban_h" + obj).html('<a href="' + val.url + '" target="_blank"><img src="' + val.picUrl + '" /></a>'));
							mod.splice(i, 1);
							col += 1;
							return false;
						} else if (typeof obj == "object") {
							var html = [];
							jQuery.each(obj, function(n, xtype) {
								var val = data[col];
								if (val) html.push('<div class="ban_h' + xtype + '"><a href="' + val.url + '" target="_blank"><img src="' + val.picUrl + '" /></a></div>');
								col += 1;
							});
							item.html(html.join(''));
							mod.splice(i, 1);
							return false;
						}
					});
				});
				jQuery(ops.dom).empty().html(colitems.html());
			});
		},
		goTop: function(ops) {
			var dom = jQuery(ops.dom);
			dom.click(function(e) {
				e.preventDefault();
				jQuery('html,body').animate({
					scrollTop: 0
				});
			});
			var bw = /(msie) ((\d+)\.(\d+))/.exec(navigator.userAgent.toLowerCase()),
				win_scroll = function() {
					var toTopevent = doc.documentElement.scrollTop || doc.body.scrollTop;
					if (oldtoTopevent != toTopevent) {
						clearTimeout(rightTimeout)
						rightTimeout = setTimeout(function() {
							var height = jQuery(win).height(),
								boxheight = dom.height(),
								toTop = (doc.documentElement.scrollTop || doc.body.scrollTop || 0) + (height - boxheight) - 20;
							if (toTop < screen.height) {
								dom.hide();
							} else {
								dom.css({
									position: "absolute"
								}).show().stop().animate({
									top: toTop + "px"
								}, "slow");
							}
						}, 0);
						oldtoTopevent = toTopevent;
					}
				};
			if (bw && bw[1] == "msie" && /6/.test(bw[3])) {
				jQuery(win).on("scroll", win_scroll);
			} else {
				jQuery(win).on("scroll", function() {
					if (dom.offset().top < screen.height) {
						dom.hide();
					} else {
						dom.show();
					}
				});
				jQuery(win).trigger("scroll");
			}
		},
		login: function(ops) {
			var login = jQuery.cookie("mmia_user") || false,
				df = {
					uid: "114",
					usname: "user123",
					usico: siteHost.home + "/images/user.jpg"
				};
			if (login) {
				login = login.split('==');
				var userId = login[0],
					userName = login[1];
				if (ops.loginSuccess) ops.loginSuccess(ops, df);
			} else {
				if (ops.noLogin) ops.noLogin(ops, df);
			}
		}
	};
});