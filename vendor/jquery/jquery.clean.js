(function($) {
	$.clean = function(node) {
		sanitise(node);
		merge(node);
		unwrap(node);
		unanchor(node);
		//removeEmpty(node, 'p');
		node.normalize();
	};

	var styles = {
		i: ['font-style', 'italic'],
		b: ['font-weight', 'bold'],
		sc: ['font-variant', 'small-caps'],
		strike: ['text-decoration', 'line-through'],
		sub: ['vertical-align', 'sub'],
		sup: ['vertical-align', 'super'],
		u: ['text-decoration', 'underline'],
	};

	var sanitise = function(node) {
		if (!node.nodeName) {
			return;
		}

		switch (node.nodeName) {
			case 'A':
			case 'P':
			case 'SPAN':
			case 'IMG':
			case 'TABLE':
			case 'TBODY':
			case 'THEAD':
			case 'TR':
			case 'TD':
			case 'OL':
			case 'UL':
			case 'LI':
			case '#text':
			case 'BODY':
			case 'ARTICLE':
			case 'MAIN':
			case 'HEADER':
			case 'FOOTER':
			case 'SECTION':
			case 'H2':
			break;

			default:
			return;
		}

		if (node.childNodes.length) {
			for (var i = 0; i < node.childNodes.length; i++) {
				var item = node.childNodes[i];

				if (item.nodeType === 1) {
					sanitise(item);
				}
			}
		}

		var item = $(node);
		var elementStyle = css(item);
		var wrapper;

		$.each(styles, function(property, style) {
			if (elementStyle[style[0]] == style[1]) {
				wrapper = document.createElement(property);
				item.wrapInner(wrapper);
			}
		});

		item.removeAttr('class');
	};

	// http://stackoverflow.com/a/5830517/145899
	var css = function(a){
		var sheets = document.styleSheets;
		var o = {};

		for (var i in sheets) {
			try {
				var rules = sheets[i].rules || sheets[i].cssRules;
				for (var r in rules) {
					var selector = rules[r].selectorText;
					if (selector && !selector.match(/:/) && a.is(selector)) {
						o = $.extend(o, css2json(rules[r].style), css2json(a.attr('style')));
					}
				}
			} catch (e) {
				console.log(e.message);
			}
		}

		return o;
	};

	// http://stackoverflow.com/a/5830517/145899
	var css2json = function(css){
		var s = {};

		if (!css) {
			return s;
		}

		if (css instanceof CSSStyleDeclaration) {
			for (var i in css) {
				if ((css[i]).toLowerCase) {
					s[(css[i]).toLowerCase()] = (css[css[i]]);
				}
			}
		} else if (typeof css == 'string') {
			css = css.split(/;\s*/);
			for (var i in css) {
				var l = css[i].split(/:\s*/);
				s[l[0].toLowerCase()] = (l[1]);
			};
		}

		return s;
	};

	var merge = function(root) {
		var nodes = root.querySelectorAll('span');

		for (var i = 0; i < nodes.length; i++) {
			if (typeof nodes[i] == undefined) {
				break;
			}

			var node = nodes[i];
			var sibling = node.nextSibling;

			if (!sibling) {
				continue;
			}

			if (sibling.nodeName == 'SPAN') {
				while (sibling.firstChild) {
					node.appendChild(sibling.firstChild);
				};
				sibling.parentNode.removeChild(sibling);
			}
		}
	};

	var unwrap = function(root) {
		var nodes = root.querySelectorAll('span');

		for (var i = 0; i < nodes.length; i++) {
			var span = nodes[i];
			var parent = span.parentNode;

			while (span.firstChild) {
				parent.insertBefore(span.firstChild, span);
			};

			parent.removeChild(span);
		}
	};

	var unanchor = function(root) {
		var nodes = root.querySelectorAll('a[name]');

		for (var i = 0; i < nodes.length; i++) {
			var a = nodes[i];
			var parent = a.parentNode;

			while (a.firstChild) {
				parent.insertBefore(a.firstChild, a);
			};

			parent.setAttribute('id', a.getAttribute('name'));
			parent.removeChild(a);
		}
	};

	var removeEmpty = function(root, nodeName) {
		var nodes = root.querySelectorAll(nodeName);

		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];

			if (!node.textContent.trim().length) {
				node.parentNode.removeChild(node);
			}
		}
	};
})(jQuery);
