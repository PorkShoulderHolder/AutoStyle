autoStyle.js uses the figue.js class written by Jean-Yves Delort to do k-means clustering to the colors in an image. 
It provides methods for generating a number of colors from an image. Included is an index.html file that you can use to see the code in action.
In firefox/safari you can change to different images by dragging and dropping them onto the image ~ in chrome this functionality doesnt work..

make sure to import figue.js before autoStyle.js and autoStyle.js before you use it in your javascript.

NOTE: Make sure to serve the example rather than looking at it with file://, because some canvas operations have trouble with local files.
You can run python -m SimpleHTTPServer in the autostyle directory (in terminal) to fix it, and then view the files at localhost:8000 .
 
Example usage:
	

	//how many clusters?
	
	var clusterCount = 10;
	
	
	//every 4th pixel is read (this speeds things up) i.e. every resolution^2 pixel
	
	var resolution = 2;


	// specify the image to perform clustering on

	var image = document.getElementById('test_image');


	//perform clustering on image
	
	var photoInfo = autoStyle.getClusters(clusterCount,image,resolution);
	
	
	//the set of clusters is
	
	var clusters = photoInfo.clusters;
	
	
	//further filter the clusters to pick the best ones for an image. Each color object is an array of 3 values.
	//This function is pretty subjective, and should probably be customised per-application.
	
	var colors = autoStyle.processClusters(photoInfo,threshold);
	
	
	//use colors in your webpage!
	
	var highlight1 = colors.highlight1color;
	var highlight2 = colors.highlight2color;
	var background = colors.backgColor;
	
	document.getElementById('test').style.background = "rgb("+Math.floor(background[0])+","+Math.floor(background[1])+","+Math.floor(background[2])+")";
	document.getElementById('test').style.color = "rgb("+Math.floor(highlight2[0])+","+Math.floor(highlight2[1])+","+Math.floor(highlight2[2])+")";
	document.getElementById('accent1').style.color = "rgb("+Math.floor(highlight1[0])+","+Math.floor(highlight1[1])+","+Math.floor(highlight1[2])+")";

	
	
	

