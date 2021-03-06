define(function(require, exports, module) {
	String.prototype.getQueryString = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = this.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	};
	String.prototype.tmpl = function(data) {
		return tmpl(this, data);
	};
	var getLen = function(str, type) {
		var str = (str + "").replace(/\r|\n/ig, ""),
			temp1 = str.replace(/[^\x00-\xff]/g, "**"),
			temp2 = temp1.substring(0),
			x_length = !type ? (temp2.split("\*").length - 1) / 2 + (temp1.replace(/\*/ig, "").length) : temp2.length;
		return x_length;
	};
	String.prototype.getLength = function(bool){
		return getLen(this, bool);
	};
	var tmpl = (function() {
			var tmplFuns = {};
			var sArrName = "sArrCMX",
				sLeft = sArrName + '.push("';
			var tags = {
				'=': {
					tagG: '=',
					isBgn: 1,
					isEnd: 1,
					sBgn: '",encode4HtmlValue(',
					sEnd: '),"'
				},
				'js': {
					tagG: 'js',
					isBgn: 1,
					isEnd: 1,
					sBgn: '");',
					sEnd: ';' + sLeft
				},
				'js': {
					tagG: 'js',
					isBgn: 1,
					isEnd: 1,
					sBgn: '");',
					sEnd: ';' + sLeft
				},
				'if': {
					tagG: 'if',
					isBgn: 1,
					rlt: 1,
					sBgn: '");if',
					sEnd: '{' + sLeft
				},
				'elseif': {
					tagG: 'if',
					cond: 1,
					rlt: 1,
					sBgn: '");} else if',
					sEnd: '{' + sLeft
				},
				'else': {
					tagG: 'if',
					cond: 1,
					rlt: 2,
					sEnd: '");}else{' + sLeft
				},
				'/if': {
					tagG: 'if',
					isEnd: 1,
					sEnd: '");}' + sLeft
				},
				'for': {
					tagG: 'for',
					isBgn: 1,
					rlt: 1,
					sBgn: '");for',
					sEnd: '{' + sLeft
				},
				'/for': {
					tagG: 'for',
					isEnd: 1,
					sEnd: '");}' + sLeft
				},
				'while': {
					tagG: 'while',
					isBgn: 1,
					rlt: 1,
					sBgn: '");while',
					sEnd: '{' + sLeft
				},
				'/while': {
					tagG: 'while',
					isEnd: 1,
					sEnd: '");}' + sLeft
				}
			};
			return function(sTmpl, opts) {
				var fun = tmplFuns[sTmpl];
				if (!fun) {
					var N = -1,
						NStat = [];
					var ss = [
						[/\{strip\}([\s\S]*?)\{\/strip\}/g,
							function(a, b) {
								return b.replace(/[\r\n]\s*\}/g, " }").replace(/[\r\n]\s*/g, "");
							}
						],
						[/\\/g, '\\\\'],
						[/"/g, '\\"'],
						[/\r/g, '\\r'],
						[/\n/g, '\\n'],
						[
							/\{[\s\S]*?\S\}/g,
							function(a) {
								a = a.substr(1, a.length - 2);
								for (var i = 0; i < ss2.length; i++) {
									a = a.replace(ss2[i][0], ss2[i][1]);
								}
								var tagName = a;
								if (/^(=|.\w+)/.test(tagName)) {
									tagName = RegExp.$1;
								}
								var tag = tags[tagName];
								if (tag) {
									if (tag.isBgn) {
										var stat = NStat[++N] = {
											tagG: tag.tagG,
											rlt: tag.rlt
										};
									}
									if (tag.isEnd) {
										if (N < 0) {
											throw new Error("Unexpected Tag: " + a);
										}
										stat = NStat[N--];
										if (stat.tagG != tag.tagG) {
											throw new Error("Unmatch Tags: " + stat.tagG + "--" + tagName);
										}
									} else if (!tag.isBgn) {
										if (N < 0) {
											throw new Error("Unexpected Tag:" + a);
										}
										stat = NStat[N];
										if (stat.tagG != tag.tagG) {
											throw new Error("Unmatch Tags: " + stat.tagG + "--" + tagName);
										}
										if (tag.cond && !(tag.cond & stat.rlt)) {
											throw new Error("Unexpected Tag: " + tagName);
										}
										stat.rlt = tag.rlt;
									}
									return (tag.sBgn || '') + a.substr(tagName.length) + (tag.sEnd || '');
								} else {
									return '",(' + a + '),"';
								}
							}
						]
					];
					var ss2 = [
						[/\\n/g, '\n'],
						[/\\r/g, '\r'],
						[/\\"/g, '"'],
						[/\\\\/g, '\\'],
						[/\$(\w+)/g, 'opts["$1"]'],
						[/print\(/g, sArrName + '.push(']
					];
					for (var i = 0; i < ss.length; i++) {
						sTmpl = sTmpl.replace(ss[i][0], ss[i][1]);
					}
					if (N >= 0) {
						throw new Error("Lose end Tag: " + NStat[N].tagG);
					}

					sTmpl = sTmpl.replace(/##7b/g, '{').replace(/##7d/g, '}').replace(/##23/g, '#');
					sTmpl = 'var ' + sArrName + '=[];' + sLeft + sTmpl + '");return ' + sArrName + '.join("");';

					tmplFuns[sTmpl] = fun = new Function('opts', sTmpl);
				}
				if (arguments.length > 1) {
					return fun(opts);
				}
				return fun;
			};
		}()),
		encode4HtmlValue = function(s) {
			return encode4Html(s).replace(/"/g, "&quot;").replace(/'/g, "&#039;");
		},
		encode4Html = function(s) {
			var el = document.createElement('pre');
			var text = document.createTextNode(s);
			el.appendChild(text);
			return el.innerHTML;
		}

	return {
		tmpl: tmpl
	};
});