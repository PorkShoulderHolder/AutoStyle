
/*!
 * AutoStyle v1.0.1
 *
 * Copyright 2013, Uncorked Studios
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

   

   function getVectors(img){
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
      res = Math.floor(Math.sqrt((pixels.width*pixels.height)/11000));
      console.log(res);
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

   function getClusters(k,img){
      var info = getVectors(img);
      var vectors = info.vectors;
      var clusters = figue.kmeans(k,vectors);
      return {'clusters':clusters,'vectors':info.vectors,'redAvg':info.redAvg,'greenAvg':info.greenAvg,'blueAvg':info.blueAvg};
   }
      return{
      'getVectors': getVectors,
      'getClusters': getClusters
   }
}();
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
      
      return new Array(Y,I,Q);

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
