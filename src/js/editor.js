var Editor = (function() {

	var editor = null;
	var body = $("body");

	function init() {

		editor = ace.edit("editor");
		editor.setTheme("ace/theme/twilight");
		editor.getSession().setMode("ace/mode/javascript");

		editor.getSession().on('change', onCodeChange);

		onCodeChange();
	}

	function onCodeChange() {

		var content = editor.getValue();
		Graph.clear();

		try {

			result = evalContent(content);
			console.log("Result: " + result);
			Graph.render(result);
			body.removeClass("syntax_error");

		} catch(e) {
			console.error("Could not eval javascript", e);
			body.addClass("syntax_error");
		}
	}

	function evalContent(content) {
		try {
			var result = eval(content);
			if(result == undefined) {
				return retryEval(content);
			}
			return result;

		} catch(e1) {
			console.warn("Could not eval javascript "+content+", retrying with assign to var", e1);
			return retryEval(content);
		}
	}

	function retryEval(content) {
		try {
			return eval("var _x_ = " + content + ";_x_");
		} catch(e2) {
			throw "Eval failed, not retrying: " + "var _x_ = " + content + ";_x_" + e2;
		}
	}

	return {
		init:init
	};
})();