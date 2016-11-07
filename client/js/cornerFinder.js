    function point(x,y,time){
      this.x = x;
      this.y = y;
      this.time = time;
      function getX(){
          return this.x;
      }
      function getY(){
          return this.y;
      }
      function getTime(){
          return this.time;
      }
    }
    
    
	function distance(p1,p2){
		var x1 = p1.getX();
		var x2 = p2.getX();
		var y1 = p1.getY();
		var y2 = p2.getY();
		var dx = x1 - x2;
		var dy = y1 - y2;
		return Math.sqrt(dx*dx+dy*dy);
	}
	function pathDistance(points,a,b){
		var d = 0;
		for (var i = a; i<b;i++){
			d = d + distance(points[i],points[i+1]);
		}
		return d;
	} 
	function isLine(points,a,b){
		var threshold = 0.95;
		var Distance = distance(points[a],points[b]);
		var path = pathDistance(points,a,b);
		if(Distance/path > threshold) return true;
		return false;
	}
	function determineResampleSpacing(points){
		var minX = Infinity;
		var minY = Infinity;
		var maxX = 0;
		var maxY = 0;
		for (var i=0;i<points.length;i++){
			if(points[i].getX()<minX) minX = points[i].getX();
			if(points[i].getY()<minY) minY = points[i].getY();
			if(points[i].getX()>maxX) maxX = points[i].getX();
			if(points[i].getY()>maxY) maxY = points[i].getY();
		}
		var dx = maxX-minX;
		var dy = maxY-minY;
		var d = Math.sqrt(dx*dx+dy*dy);
		return d/6.5
	}
	
	function resamplePoints(points,S){
		var resampled = [points[0]]
		var D = 0;  
		for (var j = 1; j < points.length; j++) { 
			var d = distance(points[j-1],points[j]);
			if(D+d>= S){
				//var newPoint = jQuery.extend(true, {}, points[0]); 
				var X = points[j-1].getX()+ (S-D)/d * (points[j].getX()-points[j-1].getX());
				var Y = points[j-1].getY()+ (S-D)/d * (points[j].getY()-points[j-1].getY());
				var T = points[j-1].getTime() + ((S-D)/d)*(points[j].getTime() - points[j-1].getTime());
				var P = new point(X,Y,T); 
				  
				resampled.push(P);
				points.splice(j,0,P);
				D=0;
			}
			else{
				D = D+d;
			}
							
		}
		return resampled;
	}
	function getCorners(points){
		var W = 3;
		var straw = [];
		var straw_copy = [];
		var corners = [0]; 
		for (var i = W;i< points.length-W;i++){
			straw[i] = distance(points[i-W],points[i+W]);
			straw_copy.push(straw[i]);
		}

		straw_copy.sort();
		var threshold;
		if(straw_copy.length%2==0) threshold = 0.95 * (straw_copy[straw_copy.length/2] + straw_copy[straw_copy.length/2-1])/2;
		else 	threshold = 0.95 * straw_copy[(straw_copy.length-1)/2];
 		/*
 		l = [];
 		for (var i=0;i<W;i++) l.push(0);
 		for (var i = W;i< points.length-W;i++){
			l.push(straw[i]-threshold);
			 
		} 
 		console.log(l);
		*/ 	 
		var localMin,localMinIndex;
		

		for(var i=W;i< points.length-W;i++){
			if(straw[i]<threshold){
				localMin = Infinity;
				localMinIndex = i;
				 
				while(i< points.length-W && straw[i]<threshold){

					if(straw[i]<localMin){
						localMin = straw[i];
						localMinIndex = i;
					}
					i++;	
				}
				corners.push(i);	
			}
			

		} 

		corners.push(points.length-1);
		corners = postProcessCorners(points,corners,straw);
		//console.log(corners);
		return corners;
	}
	function postProcessCorners(points,corners,straw){
		 
		while(true){
			 
			var Continue = true;
			for (var i=1;i<corners.length;i++){
				var c1 = corners[i-1];
				var c2 = corners[i];
				//console.log(points.length.toString()+' '+c1.toString()+' '+c2.toString());
				
				if(!isLine(points,c1,c2)) {
					
					var newCorner = halfwayCorner(straw,c1,c2);
					//console.log(points.length.toString()+' '+c1.toString()+' '+c2.toString()+ ' '+ newCorner.toString());
					if(newCorner!=-1){
 
						corners.splice(i,0,newCorner);
						Continue=false;	
					}
					
					//i+=1;
					//console.log(c1.toString()+' '+newCorner.toString()+' '+c2.toString());
					
					
					
				}
				//console.log(i.toString());
			}
			if(Continue==true) break; 


		}
 
		
		for (var i=1;i<corners.length-1;i++){
			var c1 = corners[i-1];
			var c2 = corners[i+1];
			if(isLine(points,c1,c2)){
				corners.splice(i,1);
				i=i-1;
			}
		}
		
		return corners;
						
	}

	function halfwayCorner(straw,a,b){
		var quarter = 	Math.floor((b-a)/4+0.0000001);
		 
		
		var minVal = Infinity;
		var minIndex; 

 

		for (var i=a+quarter;i<=b-quarter;i++){
			if(straw[i]!=undefined && straw[i]<minVal){
				minVal = straw[i];
				minIndex = i; 
			}
		} 
		if(minIndex==undefined || minIndex ==a || minIndex==b) {
			return -1;

		}
		return minIndex;
	} 
