define(function(require, exports, module) {
	var controls = require("controls"),
		common = require("common"),
		api = require("interface"),
		attentFunc = function(self) {
			var elems = self ? jQuery(".img_wrap a,.pinp_logo a", self) : jQuery(".img_wrap a,.pinp_logo a"),
				parent = elems.parent(".cell");
			if (!parent.attr("data-initAttent") || parent.attr("data-initAttent") && parent.attr("data-initAttent") != "attent") {
				parent.attr("data-initAttent", "attent");
				elems.hover(function() {
					var parent = jQuery(this).parents(".cell"),
						isAttent = parent.attr("data-attent") && parent.attr("data-attent") == "attent" ? true : false;
					jQuery(".pinp_logo img", parent).hide();
					jQuery(isAttent ? ".attent_button_ok" : ".attent_obj", parent).show();
				}, function() {
					var parent = jQuery(this).parents(".cell"),
						isAttent = parent.attr("data-attent") && parent.attr("data-attent") == "attent" ? true : false;
					jQuery(".pinp_logo img", parent).show();
					jQuery(isAttent ? ".attent_button_ok" : ".attent_obj", parent).hide();
				});
			}
		},
		t = location.search.getQueryString("t"),
		navtype = t ? t : (siteHost.debug ? /test_index\.html/ : /index\.html/).test(location.href) || !(siteHost.debug ? /test_m\.html/ : /m\.html/).test(location.href) ? "1" : "2";

	controls.goTop({
		dom: ".back_top"
	});
	jQuery(function() {
		var resize = function() {
			var width = jQuery(window).width();
			if (width >= 1200) {
				jQuery("body").removeClass("ie1000 banner_wrap_index1000").addClass("ie1200");
			} else if (width < 1200 && width > 1000) {
				jQuery("body").removeClass("banner_wrap_index1000 ie1200").addClass("ie1000");
			} else {
				jQuery("body").removeClass("ie1200 ie1000").addClass("banner_wrap_index1000");
			}
		};
		jQuery(window).on("resize", resize);
		resize();
	});
	/*controls.screenEvent({
		type: "msie",
		maxVer: 9,
		dom: ".new_magazine_box,.waterfall_wrap,.header_wrap .header,.top_wrap .top,.main,.channel_banner",
		condit: function() {
			var width = jQuery(window).width();
			return {
				width: width < 1200 ? "960px" : "1200px"
			};
		},
		css: {
			margin: "0 auto"
		}
	}).handle([{
		dom: window,
		event: {
			"resize": function(e, done) {
				done();
			}
		}
	}]).done();*/
	controls.login({
		loginSuccess: function(target, data) {
			if (jQuery(".logged,.nologged").length > 0) jQuery(".logged,.nologged").remove();
			var html = (jQuery("#logged").html()).tmpl(data),
				dom = jQuery(html);
			jQuery(".pageheader").append(dom);
			jQuery(".uslogout").off("click").on("click", function(e) {
				e.preventDefault();
				jQuery.cookie("mmia_user", "");
				jQuery(".logged").hide();
				target.noLogin(target, data);
			});
			jQuery(".usinfo").hover(function() {
				jQuery(".usinfo_menu").show();
				jQuery(this).parents(".right").addClass("user_download2");
			}, function() {
				jQuery(".usinfo_menu").hide();
				jQuery(this).parents(".right").removeClass("user_download2");
			});
			jQuery(".down_app").hover(function() {
				jQuery(".erwm_wrap", this).show();
			}, function() {
				jQuery(".erwm_wrap", this).hide();
			});
		},
		noLogin: function(target, data) {
			if (jQuery(".logged,.nologged").length > 0) jQuery(".logged,.nologged").remove();
			jQuery(".pageheader").append(jQuery(jQuery("#nologged").html()));
			jQuery(".use_login,.use_registr").off("click").on("click", function(e) {
				e.preventDefault();
				if (jQuery(this).hasClass("use_login")) {
					jQuery(".nologged").hide();
					jQuery.cookie("mmia_user", "114==user123");
					target.loginSuccess(target, data);
				} else {
					location.href = ((jQuery(this).attr("href")).tmpl({
						host: "http://test.mmia.com",
						random: Math.random(),
						url: location.href
					}));
				}
			});
			jQuery(".down_app").hover(function() {
				jQuery(".erwm_wrap", this).show();
			}, function() {
				jQuery(".erwm_wrap", this).hide();
			});
		}
	});
	controls.searchbox({
		dom: ".searchbox",
		input: ".searchbox_input",
		submit: ".searchbox_button",
		keybox: ".searchbox_keys",
		getHotword: function(elem) {
			jQuery.get(api.hotword, function(data) {
				if (data && data.status == "ok") {
					elem.val(data.name || "").attr("data-deftext", data.name || "").addClass('color_gray');
				}
			}, "json");
		},
		getKeyItems: function(eventFunc) {
			jQuery.get(api.searchhotkey, function(data) {
				if (data && data.status == "ok") {
					var len = data.data && data.data.length || 0,
						html = [];
					if (len > 0) {
						jQuery.each(data.data, function(i, obj) {
							html.push('<a href="' + obj.url + '"' + (obj.isRed == 1 ? ' class="active"' : "") + ' target="_blank">' + obj.word + '</a>' + (i + 1 >= len ? "" : "|"));
						});
						eventFunc(html.join(''));
					}
				}
			}, "json");
		}
	});
	controls.headernav({
		dom: ".headernav_items",
		activeItem: navtype,
		getNavItems: function(type, eventFunc) {
			jQuery.get(api.channels, function(data) {
				if (data && data.status == "ok") {
					var html = [],
						len = data.data && data.data.length || 0;
					if (len > 0) {
						jQuery.each(data.data, function(i, item) {
							html.push('<li' + (type == item.id ? ' class="active"' : "") + '><a href="' + item.id + '">' + item.name + '</a></li>');
						});
						eventFunc(html.join(''), data.data);
					}
				}
			}, "json");
		}
	});
	if (navtype == "1") {
		controls.slidebanner({
			list: ".banner_list",
			view: ".banner_view",
			time: 600,
			waitTime: 600,
			intervalTime: 2000,
			getBannerItem: function(self, eventFunc) {
				jQuery.get(api.homebanner, function(data) {
					if (data && data.status == "ok") {
						var html = [],
							shtml = [],
							len = data.data && data.data.length || 0;
						if (len > 0) {
							jQuery.each(data.data, function(i, obj) {
								obj.bigbanner = '<div><a href="' + obj.url + '" target="_blank"><img src="' + obj.bigPic + '" alt="" title="" /></a></div>';
								obj.smallbanner = '<a href="' + obj.url + '" target="_blank"><img src="' + obj.smallPic + '" alt="" title="" /></a>';
								html.push(obj.bigbanner);
								shtml.push(obj.smallbanner);
							});
							jQuery(".banner_wrap_index").html((jQuery("#homebanner").html()).tmpl({
								bigbanner: html.join(''),
								smallbanner: shtml.join('')
							}));
							eventFunc();
						}
					}
				}, "json");
			}
		});
	} else {
		controls.imgbanner({
			dom: ".channel_banner",
			getBannerItem: function(eventFunc) {
				/*var data = [{
					picUrl: "1",
					url: ""
				}, {
					picUrl: "2",
					url: ""
				}, {
					picUrl: "3",
					url: ""
				}, {
					picUrl: "4",
					url: ""
				}, {
					picUrl: "5",
					url: ""
				}, {
					picUrl: "6",
					url: ""
				}, {
					picUrl: "7",
					url: ""
				}];
				eventFunc(data, navtype);*/
				jQuery.get(api.channelbanner.tmpl({
					channelId: navtype
				}), function(data) {
					if (data && data.status == "ok") {
						var html = [],
							len = data.data && data.data.length || 0;
						if (len > 0) {
							eventFunc(data.data, navtype);
						}
					}
				}, "json");
			}
		});
	}
	controls.scrollExec({
		getElemsOffset: function() {
			var func = [{
				top: jQuery(".new_magazine_box").offset().top,
				func: function() {
					controls.magazine({
						box: ".new_magazine_box",
						list: ".magazine_items",
						getMagazineItems: function(eventFunc) {
							jQuery.get(api.magazine.tmpl({
								n: 10,
								channelId: navtype
							}), function(data) {
								if (data && data.status == "ok") {
									var html = [],
										len = data.data && data.data.length || 0;
									if (len > 0) {
										jQuery.each(data.data, function(i, obj) {
											html.push('<li><a href="' + obj.url + '" target="_blank"><img src="' + obj.pictureUrl + '" /></a></li>');
										});
										eventFunc(html.join(''));
									}
								}
							}, "json");
						}
					});
				}
			}, {
				top: jQuery(".waterfall_wrap").offset().top,
				func: function() {
					attentFunc();
					var loaded = false;

					function loadData(index, type, render) {
						if (loaded) return;
						var loadmore = jQuery(".load_more");
						if (index >= 4) {
							loadmore.html("已经到底...").show().css({
								opacity: 1
							}).delay(1000).animate({
								opacity: 0
							}, "slow", function() {
								loadmore.hide();
							});
							return;
						} else {
							loadmore.html("正在加载...").show().css({
								opacity: 1
							});
						}
						loaded = true;
						jQuery.get(api.hotmaga.tmpl({
							p: index,
							cId: type,
							channelId: navtype
						}), function(data) {
							if (data && data.status == "ok") {
								var html = [],
									len = data.data && data.data.length || 0;
								if (len > 0) {
									var mod = jQuery("#waterfall_items").html();
									jQuery.each(data.data, function(i, obj) {
										if (i + 1 > 20) return false;
										html.push(mod.tmpl(obj));
									});
									var $element = jQuery(html.join(''));
									render($element, function() {
										loadmore.css({
											opacity: 1
										}).hide();
									});
									loaded = false;
								} else {
									loaded = false;
									loadmore.css({
										opacity: 1
									}).hide();
								}
							}
						}, "json");
					}
					jQuery("#container").waterfall({
						column_width: 230,
						column_space: 10,
						auto_imgHeight: true,
						insert_type: 1,
						itemInit: function(elem) {
							attentFunc(elem);
							jQuery(".attent_obj", elem).click(function(e) {
								e.preventDefault();
								jQuery(this).hide();
								var parent = jQuery(this).parent();
								jQuery(".attent_button_ok", parent).show();
								parent.parents(".cell").attr("data-attent", "attent");
							});
						},
						createColumn: function(data, column_num) {
							//循环创建列
							var html = [];
							for (var i = 0; i < column_num; i++) {
								html.push('<div class="' + data.column_className + '" style="width:' + data.column_width + 'px; display:inline-block; *display:inline;zoom:1; margin-left:' + data.column_space / 2 + 'px;margin-right:' + data.column_space / 2 + 'px; vertical-align:top; overflow:hidden"></div>');
							}
							return html.join('');
						},
						getColumnItems: function(index, type, render) {
							loadData(index, type, render);
						},
						onRefresh: function() {
							attentFunc();
						},
						type: "1",
						nav: ".waterfall_nav",
						getNavItems: function(type, render, eventFunc) {
							var cookie = jQuery.cookie("channelpath") && (jQuery.cookie("channelpath")).split('_'),
								id = cookie && cookie[0] || navtype;
							type = cookie && id == navtype && cookie[1] || type;
							jQuery.get(api.categroy.tmpl({
								channelId: navtype
							}), function(data) {
								if (data && data.status == "ok") {
									var html = [],
										len = data.data && data.data.length || 0;
									if (len > 0) {
										jQuery.each(data.data, function(i, obj) {
											html.push('<a href="' + obj.id + '"' + (obj.id == type ? ' class="active"' : '') + ' data-parentType="'+navtype+'">' + obj.category + '</a>' + (i + 1 >= len ? "" : '<span>.</span>'));
											if (obj.id == type) {
												loadData(0, type, render);
											}
										});
										eventFunc(html.join(''));
									}
								}
							}, "json");
						}
					});
				}
			}];
			return func;
		}
	});
	jQuery(window).trigger('scroll');
});