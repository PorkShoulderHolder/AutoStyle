
/*!
 * AutoStyle v1.0.1
 *
 * Copyright 2013, Sam Royston/Uncorked Studios
 * Licensed under the MIT license.
 *
 */


var autoStyle = function () {
   
   loadScript('figue.js',callback);

   function loadScript(url, callback)
   {
       // adding the script tag to the head as suggested before
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;

      // then bind the event to the callback function 
      // there are several events for cross browser compatibility
      script.onreadystatechange = callback;
      script.onload = callback;

      // fire the loading
      head.appendChild(script);
   }

   function callback(){
      console.log("loaded");
   }

   function sortByDistanceFromPoint(array,point){
      array.sort(function(a,b){
          return euclidianDistance(a.centroid,point) - euclidianDistance(b.centroid,point);  
      });
      return array;
   }

   function processClusters(clusterInfo,highlight1Option,highlight2Option,backgroundOption,threshold){
      var avgColor = [clusterInfo.redAvg,clusterInfo.greenAvg,clusterInfo.blueAvg];
      var clusters = clusterInfo.clusters;
      
      var maxCluster = 0;
      var biggestCluster = null;
      var minCluster = Number.MAX_VALUE;
      var smallestCluster = null;
      var maxDistFromAvg = 0;
      var biggestDistFromAvg = null;
      var minDistFromAvg = Number.MAX_VALUE;
      var smallestDistFromAvg = null;
      var maxVariance = 0;
      var biggestVariance = null;
      var minVariance = Number.MAX_VALUE;
      var smallestVariance = null;
      console.log(clusters);
      console.log('ghgh');
      clusterArray = new Array();
      for (var i = clusters.clusterSizes.length - 1; i >= 0; i--) {
        clusterArray.push({'clusterSize':clusters.clusterSizes[i],'centroid':clusters.centroids[i],'distFromAvg':euclidianDistance(clusters.centroids[i],avgColor)});
      }
      var sortedBySize = clusterArray.sort(function(a,b){
          return a.clusterSize - b.clusterSize ;
      })
      for (var i in sortedBySize) {
        console.log('s')
        console.log(sortedBySize[i]);
      };
      var highlight1color = [255,255,255];
      var highlight2color = [255,255,255];
      var backgroundColor = [255,255,255];
      
      backgroundColor = sortedBySize[sortedBySize.length-1].centroid;
      console.log(backgroundColor);
      console.log('asd');
      var sortedByDistFromAvg = sortByDistanceFromPoint(clusterArray,avgColor);
      var sortedByVariance = clusters;

      
      /*
      switch(highlight1Option){
         case 0: highlight1color = sortedBySize[0].centroid; break;
         case 1: highlight1color = sortedBySize[sortedBySize.length-1].centroid;break;
         case 2: highlight1color = sortedByDistFromAvg[0].centroid;break;
         case 3: highlight1color = sortedByDistFromAvg[sortedByDistFromAvg.length-1].centroid;break;
      }
      switch(highlight2Option){
         case 0: highlight2color = sortedBySize[0].centroid; break;
         case 1: highlight2color = sortedBySize[sortedBySize.length-1].centroid;break;
         case 2: highlight2color = sortedByDistFromAvg[0].centroid;break;
         case 3: highlight2color = sortedByDistFromAvg[sortedByDistFromAvg.length-1].centroid;break;
      }
      switch(backgroundOption){
         case 0: backgroundColor = sortedBySize[sortedBySize.length-1].centroid; break;
         case 1: backgroundColor = sortedBySize[0].centroid;break;
         case 2: backgroundColor = sortedByDistFromAvg[0].centroid;break;
         case 3: backgroundColor = sortedByDistFromAvg[sortedByDistFromAvg.length-1].centroid;break;
      }
      */

      var compliment = calculateCompliment(backgroundColor);

      console.log(compliment);

      var processedCompliment = processCompliment(backgroundColor,compliment,200);

      var sortedByDistanceToCompliment = sortByDistanceFromPoint(clusterArray,processedCompliment);
      
      

      highlight1color = sortedByDistanceToCompliment[0].centroid;

      highlight2color = sortedByDistanceToCompliment[1].centroid;
    
      return{'highlight1color':highlight1color,'highlight2color':highlight2color,'backgColor':backgroundColor};
        
   }

   function colorOffset(highlight1color,highlight2color,backgroundColor){

   }

   function processCompliment(color,compliment,threshold){
      color = rgbToHsv(color[0],color[1],color[2]);
      compliment = rgbToHsv(compliment[0],compliment[1],compliment[2]);
      var processedCompliment = compliment;
      console.log(compliment);
      if (threshold > 1){
        threshold /= 255.0;
      }
      if (Math.abs(color[2]-compliment[2]) < threshold) {
          if (color[2] > compliment[2]) {
              processedCompliment[2] -= Math.abs(Math.abs(color[2]-compliment[2]) - threshold);
              console.log('minus');
          }
          else{
              processedCompliment[2] += Math.abs(Math.abs(color[2]-compliment[2]) - threshold);
              console.log('plus');
          }
      }
      console.log(processedCompliment);
      return hsvToRgb(processedCompliment[0],processedCompliment[1],processedCompliment[2]);      
   }
   

   function getVectors(img,res){
      var canvas = document.createElement('canvas');
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
      var pixels = ctx.getImageData(0,0,canvas.width,canvas.height);
      var vectors = new Array(); 
      var ravg = 0;
      var gavg = 0;
      var bavg = 0;
      if(res == 'auto'){
        res = Math.floor(Math.sqrt((pixels.width*pixels.height)/2000));
      }
      if(res < 1){
        res = 1;
      }
      res = Number(res); 
      console.log(res)
      for (var x = 0; x < pixels.width; x+=res) {
          for (var y = 0; y < pixels.height; y+=res) {
               var i = (y * pixels.width + x)*4;
               r = pixels.data[i];
               g = pixels.data[i+1];
               b = pixels.data[i+2];
               ravg += r;
               gavg += g;
               bavg += b;
               if(r != undefined && g != undefined && b != undefined){
               vectors.push([r,g,b])
               }
            }
         }
         ravg /= pixels.data.length/(4*res*res);
         gavg /= pixels.data.length/(4*res*res);
         bavg /= pixels.data.length/(4*res*res);
         return {'vectors':vectors,'redAvg':ravg,'greenAvg':gavg,'blueAvg':bavg};
      }

   function getClusters(k,img,res){
      var info = getVectors(img,res);
      var vectors = info.vectors;
      var clusters = figue.kmeans(k,vectors);
      return {'clusters':clusters,'vectors':info.vectors,'redAvg':info.redAvg,'greenAvg':info.greenAvg,'blueAvg':info.blueAvg};
   }
      return{
      'getVectors': getVectors,
      'getClusters': getClusters,
      'processClusters': processClusters
   }
}();

   function calculateCompliment(color){
      //console.log(color);
      color =  rgbToHsv(color[0],color[1],color[2]);
      color[0] = color[0] + 0.5;
      if (color[0] > 1) {
        color[0] - 1;
      };
      return hsvToRgb(color[0],color[1],color[2]);
   } 


   function hslToRgb(h, s, l){
       var r, g, b;

       if(s == 0){
           r = g = b = l; // achromatic
       }else{
           function hue2rgb(p, q, t){
               if(t < 0) t += 1;
               if(t > 1) t -= 1;
               if(t < 1/6) return p + (q - p) * 6 * t;
               if(t < 1/2) return q;
               if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
               return p;
           }

           var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
           var p = 2 * l - q;
           r = hue2rgb(p, q, h + 1/3);
           g = hue2rgb(p, q, h);
           b = hue2rgb(p, q, h - 1/3);
       }

       return [r * 255, g * 255, b * 255];
   }

   /**
    * Converts an RGB color value to HSV. Conversion formula
    * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
    * Assumes r, g, and b are contained in the set [0, 255] and
    * returns h, s, and v in the set [0, 1].
    */
   function rgbToHsv(r, g, b){
       r = r/255, g = g/255, b = b/255;
       var max = Math.max(r, g, b), min = Math.min(r, g, b);
       var h, s, v = max;

       var d = max - min;
       s = max == 0 ? 0 : d / max;

       if(max == min){
           h = 0; // achromatic
       }else{
           switch(max){
               case r: h = (g - b) / d + (g < b ? 6 : 0); break;
               case g: h = (b - r) / d + 2; break;
               case b: h = (r - g) / d + 4; break;
           }
           h /= 6;
       }

       return [h, s, v];
   }

   /**
    * Converts an HSV color value to RGB. Conversion formula
    * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
    * Assumes h, s, and v are contained in the set [0, 1] and
    * returns r, g, and b in the set [0, 255].
    */
   function hsvToRgb(h, s, v){
       var r, g, b;

       var i = Math.floor(h * 6);
       var f = h * 6 - i;
       var p = v * (1 - s);
       var q = v * (1 - f * s);
       var t = v * (1 - (1 - f) * s);

       switch(i % 6){
           case 0: r = v, g = t, b = p; break;
           case 1: r = q, g = v, b = p; break;
           case 2: r = p, g = v, b = t; break;
           case 3: r = p, g = q, b = v; break;
           case 4: r = t, g = p, b = v; break;
           case 5: r = v, g = p, b = q; break;
       }

       return [r * 255, g * 255, b * 255];
   }
   function convertRGBtoYIQ(R, G, B) {

      
      var Y = (0.299*R)+(0.587*G)+(0.114*B);
      var I = (0.596*R)-(0.275*G)-(0.321*B);
      var Q = (0.212*R)-(0.523*G)+(0.311*B);
      
      return new Array(Y*2 + 255,I*2 +255,Q*2 +255);

   }
   function euclidianDistance (vec1 , vec2) {
         var N = vec1.length ;
         var d = 0 ;
         for (var i = 0 ; i < N ; i++)
            d += Math.pow (vec1[i] - vec2[i], 2)
         d = Math.sqrt (d) ;
         return d ;
      }

   function convertYIQtoRGB(Y, I, Q) {

      var R = (Y)+(0.956*I)+(0.621*Q);
      var G = (Y)-(0.275*I)-(0.647*Q);
      var B = (Y)-(1.107*I)+(1.705*Q);
      
      return new Array(R,G,B);
   }
