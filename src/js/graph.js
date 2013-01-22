var Graph = (function() {

	// jquery node
	var node = null;
	// window size
	var windowSize = null;
	// mxGraph object
	var graph = null;
	var layout = null;

	
	function init() {
		// Checks if the browser is supported
		if (!mxClient.isBrowserSupported()) {
			// Displays an error message if the browser is not supported.
			mxUtils.error('Browser is not supported!', 200, false);
		} else {
			// Enables crisp rendering of rectangles in SVG
			mxRectangleShape.prototype.crisp = true;
			
			// Creates the graph inside the given container
			node = $("#graph-container");
			graph = new mxGraph(node.get(0));
			// Enables rubberband selection
			new mxRubberband(graph);


			// Sets the default edge style
			var style = graph.getStylesheet().getDefaultVertexStyle();
			style[mxConstants.STYLE_GRADIENTCOLOR] = "black";
			style[mxConstants.STYLE_ROUNDED] = true;
			style[mxConstants.STYLE_FONTCOLOR]= 'white';
			style[mxConstants.STYLE_STROKECOLOR] = '#666';

			style = graph.getStylesheet().getDefaultEdgeStyle();

			style[mxConstants.STYLE_ROUNDED] = true;
			style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
			style[mxConstants.STYLE_STROKECOLOR] = 'white';
			style[mxConstants.STYLE_FONTCOLOR]= 'white';

			layout = new mxFastOrganicLayout(graph);
			layout.forceConstant = 90;

			var w = $(window);
			windowSize = {
				width: w.width(),
				height: w.height()
			};
		}
	}

	var vertexMap = {};

	/**
	 * Clears the graph
	 */
	function clear() {
		graph.getModel().clear();
	}
	
	/**
	 * Render a JavaScript object
	 */
	function render(obj) {

		// reset
		vertexMap = {};

		// Gets the default parent for inserting new cells. This
		// is normally the first child of the root (ie. layer 0).
		var parent = graph.getDefaultParent();
						
		// Adds cells to the model in a single step
		graph.getModel().beginUpdate();
		try {
			createVertex(obj, graph, parent);
		} finally {
			// Updates the display
			graph.getModel().endUpdate();
		}
		// perform layout


		console.log("Performing layout");
		layout.execute(parent);
	}

	function createVertex(obj, graph, parent) {

		console.log("createVertex", obj);
		if(vertexMap[obj] != null) {
			return vertexMap[obj];
		}
		return createVertex_(obj, graph, parent);
	}


	function createVertex_(obj, graph, parent) {
		if(obj == null) {
			return vertex("null", graph, parent);
		}
		console.log("createVertex_", typeof obj);
		if(isSimple(obj)) {
			return vertex(obj, obj, graph, parent, {small:true});
		} else {
			return createObjectVertex(obj, graph, parent);
		}
		return null;
	}

	function createObjectVertex(obj, graph, parent) {

		var isFunction = typeof obj === "function";
		var label = isFunction ? "function" : "object";
		if(isFunction && obj.name) {
			label +=" " + obj.name;
		}
		var parentVertex = vertex(obj, label, graph, parent, {type:typeof obj});
		for(var key in obj) {
			if(obj.hasOwnProperty(key)) {
				createChild(obj, key, parentVertex, graph, parent);
			}
		}

		var props = ["prototype", "__proto__", "constructor"];
		for(var i=0;i<props.length;i++) {
			if(obj[props[i]]!=null) {
				createChild(obj, props[i], parentVertex, graph, parent);
			}
		}
		return parentVertex;
	}

	function createChild(obj, key, parentVertex, graph, parent) {

		var val = obj[key];
		var childVertex = createVertex(val, graph, parent)
		graph.insertEdge(parent, null, key, parentVertex, childVertex);
		return childVertex;
	}
	
	function vertex(originalObj, label, graph, parent, options) {
		var small  = options ? options.small : false;
		var w = small ? 50 : 120;
		var h = small ? 30 : 60;

		// put the vertices randmly around the right part of the scree
		// the layout algorithms dont work if they are all stacked
		// upon each other
		var x = Math.floor(Math.random()*windowSize.width/2);
		var y = Math.floor(Math.random()*windowSize.height/2);

		var style = "";
		if(options.type === "function") {
			style = "fillColor=#660";
		}
		if(options.type === "object") {
			style = "fillColor=#060";
		}

		var vertex = graph.insertVertex(
			parent, null, label,
			x, y, w, h,
			style
		);
		vertexMap[originalObj] = vertex;
		return vertex;
	}

	function isSimple(obj) {
		switch(typeof obj) {
			case "number":
			case "string":
			case "boolean":
			case "undefined":
				return true;
			case "object":
			case "function":
		}
		return false;
	}

	return {
		init: init,
		render:render,
		clear:clear
	}
})();