autoStyle.js uses the figue.js class written by Jean-Yves Delort to do k-means clustering to the colors in an image. 
It provides methods for generating a number of colors from an image. Included also is an index.html file that you can use to test parameters 
and how they work on different images.

make sure to import figue.js before autoStyle.js and autoStyle.js before you use it in your javascript.

NOTE: google Chrome currently has issues with reading the photos with this method, due to a 'tainted canvas', try firefox or safari. I will add code to load images locally in order to avoid this.
 
Example usage:
	

	//how many clusters?
	
	var clusterCount = 10;
	
	
	//every 4th pixel is read (this speeds things up) i.e. every resolution^2 pixel
	
	var resolution = 2;
	
	
	//perform clustering on image
	
	var photoInfo = autoStyle.getClusters(clusterCount,dropbox,resolution);
	
	
	//the set of clusters is
	
	var clusters = photoInfo.clusters;
	
	
	//further filter the clusters to pick the best ones for an image. This each color object is an array of 3 values
	
	var colors = autoStyle.processClusters(photoInfo,threshold);
	
	
	//use colors in your webpage!
	
	var highlight1 = colors.highlight1color;
	var highlight2 = colors.highlight2color;
	var background = colors.backgColor;
	
	document.getElementById('test').style.background = "rgb("+Math.floor(background[0])+","+Math.floor(background[1])+","+Math.floor(background[2])+")";
	document.getElementById('test').style.color = "rgb("+Math.floor(highlight2[0])+","+Math.floor(highlight2[1])+","+Math.floor(highlight2[2])+")";
	document.getElementById('accent1').style.color = "rgb("+Math.floor(highlight1[0])+","+Math.floor(highlight1[1])+","+Math.floor(highlight1[2])+")";

	
	
	

