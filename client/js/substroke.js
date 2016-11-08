
	
	// get multistrokes from input points
	function stroke(points){
		// to store the list of strokes,each stroke is a list of points
		var stroke = [];
		// temporary store points for each stroke, then push to stroke[]
		var strokepoints = [];
		// to get time differece
		var previous = 0;
		for (var i = 0; i < points.length; i++){
			if (previous != 0){
				var diff = points[i].time - previous;
				if (diff < 500){
					// push points to strokepoints if no big gap found
					strokepoints.push(points[i]);
				}
				else{
					// if gap found, push previous strokepoints as a stroke to stroke[]
					stroke.push(strokepoints);	
									
					//console.log("change");
					
					// empty strokepoints
					strokepoints = [];
					// add the first point of the next stroke to a new strokepoints set
					strokepoints.push(points[i]);
				}
			}
			previous = points[i].time;
			
		}
		// add the last stroke
		stroke.push(strokepoints);
		//console.log(stroke);
		return stroke;
	}