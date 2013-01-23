$(function() {

	Graph.init();
	Editor.init();

	console.log("Showing welcome");
	doOnce(showWelcome);
});

/**
 * Perform the function f only once on a computer.
 * It remembers the state between page refreshes using cookies.
 *
 * @param f the function to execute once, doesnt work with anonymous functions
 */
function doOnce(f) {

	if($.cookie(f.name) === null) {
		$.cookie(f.name, "true");
		f();
	}
}

function showWelcome() {
	window.setTimeout(function() {

		$("#welcomeModal").modal({});
	}, 500);
}