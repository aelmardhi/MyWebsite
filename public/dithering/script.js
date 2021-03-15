//var img = new Image();   // Create new img element
//img.src = '/home/aelmardhi/Pictures/Screenshot from [EgyBest].Young.Sheldon.S02E12.WEB-DL.1080p.x264.mp4.png'; // Set source path
const width = 480;
const height = 270;
//const input = document.querySelector('input');
function draw(e) {
  event.preventDefault()
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    //var img = new Image(event.target.files[0]);
    //console.log(img)
  //  img.src = '///home/aelmardhi/Pictures/Screenshot from [EgyBest].Young.Sheldon.S02E12.WEB-DL.1080p.x264.mp4.png'; // Set source path
 // img.crossOrigin = "Anonymous";
      createImageBitmap(event.target.files[0]).then(function(img) {
      ctx.drawImage(img, 0, 0, width ,height);
      //img.style.display = 'none';
      
      
      var redChannel = function(g) {
        var imageData = ctx.getImageData(0,0,width, height);
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
          var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          avg = Math.floor(avg*g/ 255)/(g-1)*255 ;
          data[i]     = Math.floor(data[i]*g/ 255)/(g-1)*255 ; // red
          data[i + 1] = 0; // green
          data[i + 2] = 0; // blue
        }
        ctx.putImageData(imageData, width, 0);
      };
      var greenChannel = function(g) {
        var imageData = ctx.getImageData(0,0,width, height);
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
          
          data[i]     = 0; // red
          data[i + 1] = Math.floor(data[i+1]*g/ 255)/(g-1)*255; // green
          data[i + 2] = 0; // blue
        }
        ctx.putImageData(imageData, width * 2,  0);
      };
      var blueChannel = function(g) {
        var imageData = ctx.getImageData(0,0,width, height);
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
          
          data[i]     = 0 ; // red
          data[i + 1] = 0; // green
          data[i + 2] = Math.floor(data[i+2]*g/ 255)/(g-1)*255; // blue
        }
        ctx.putImageData(imageData, width * 3, 0);
      };
      
      var grayscale = function(g) {
        var imageData = ctx.getImageData(0,0,width,height);
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
          var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          avg = Math.floor(avg*g/ 255)/(g-1)*255 ;
          data[i]     = avg; // red
          data[i + 1] = avg; // green
          data[i + 2] = avg; // blue
        }
        ctx.putImageData(imageData, 0, height);
      };
      var random = function(g) {
        var imageData = ctx.getImageData(0,0,width,height);
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
          var avg = (data[i] + data[i + 1] + data[i + 2]) / 3 + Math.floor(Math.random() * 128);
          avg = Math.floor(avg*g/ 255)/(g-1)*255 ;
          data[i]     = avg; // red
          data[i + 1] = avg; // green
          data[i + 2] = avg; // blue
        }
        ctx.putImageData(imageData, width, height);
      };

      var floydStienbergDithering = function(g) {
        var imageData = ctx.getImageData(0,0,width, height);
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
          var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i]     = avg; // red
          data[i + 1] = avg; // green
          data[i + 2] = avg; // blue
        }
        for (var i = 0; i < data.length; i += 4) {
          var oldPixel = data[i]
          var newPxiel = Math.floor(oldPixel*g/ 255)/(g-1)*255 ;
          var quantError = oldPixel - newPxiel;
          data[i+2]  = data [i+1] = data[i] = newPxiel; // new piel
          data[i+2+4]  = data [i+1+4] = data[i+4] = data[i+4] +  Math.floor(quantError * 7 / 16); // pixel [x+1][y]
          data[i+2-4+width]  = data [i+1-4+width] = data[i-4+width] = data[i-4+width] +  Math.floor(quantError * 3 / 16); // pixel [x-1][y+1]
          data[i+2+width]  = data [i+1+width] = data[i+width] = data[i+width] +  Math.floor(quantError * 5 / 16); // pixel [x][y+1]
          data[i+2+4+width]  = data [i+1+4+width] = data[i+4+width] = data[i+4+width] +  Math.floor(quantError * 1 / 16); // pixel [x+1][y+1]
          
        }
        ctx.putImageData(imageData, width * 3, height );
      };

      var numColors = function(g) {
        var imageData = ctx.getImageData(0,0,width, height);
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
          data[i]     = Math.floor(data[i]*g/ 255)/(g-1)*255 ; // red
          data[i + 1] = Math.floor(data[i+1]*g/ 255)/(g-1)*255; // green
          data[i + 2] = Math.floor(data[i+2]*g/ 255)/(g-1)*255; // blue
        }
        ctx.putImageData(imageData, 0, height *2);
      };

      var randomColors = function(g) {
        var imageData = ctx.getImageData(0,0,width, height);
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
          var rand1 = Math.floor(Math.random() * 128);
          var rand2 = Math.floor(Math.random() * 128);
          var rand3 = Math.floor(Math.random() * 128);
          data[i]     = Math.floor((data[i]+rand1)*g/ 255)/(g-1)*255 ; // red
          data[i + 1] = Math.floor((data[i+1]+rand2)*g/ 255)/(g-1)*255; // green
          data[i + 2] = Math.floor((data[i+2]+rand3)*g/ 255)/(g-1)*255; // blue
        }
        ctx.putImageData(imageData, width, height *2);
      };

      var floydStienbergDitheringColors = function(g) {
        var imageData = ctx.getImageData(0,0,width, height);
        var data = imageData.data;
        
        for (var i = 0; i < data.length; i += 4) {
          var oldPixelR = data[i];
          var oldPixelG = data[i+1];
          var oldPixelB = data[i+2];
          var newPxielR = Math.floor(oldPixelR*g/ 255)/(g-1)*255 ;
          var newPxielG = Math.floor(oldPixelG*g/ 255)/(g-1)*255 ;
          var newPxielB = Math.floor(oldPixelB*g/ 255)/(g-1)*255 ;
          var quantErrorR = oldPixelR - newPxielR;
          var quantErrorG = oldPixelG - newPxielG;
          var quantErrorB = oldPixelB - newPxielB;
          // new pixel
          data[i]= newPxielR; 
          data [i+1] = newPxielG;
          data[i+2]  = newPxielB;
          // pixel [x+1][y]
          data[i+4] = data[i+4] +  Math.floor(quantErrorR * 7 / 16); 
          data [i+1+4] = data[i+4+1] +  Math.floor(quantErrorG * 7 / 16);
          data[i+2+4]  = data[i+4+2] +  Math.floor(quantErrorB * 7 / 16);
          // pixel [x-1][y+1]
          data[i-4+width] = data[i-4+width] +  Math.floor(quantErrorR * 3 / 16); 
          data [i+1-4+width] = data [i+1-4+width] +  Math.floor(quantErrorG * 3 / 16);
          data[i+2-4+width]  = data[i+2-4+width] +  Math.floor(quantErrorB * 3 / 16);
          // pixel [x][y+1]
          data[i+width] = data[i+width] +  Math.floor(quantErrorR * 5 / 16); 
          data [i+1+width] = data [i+1+width] +  Math.floor(quantErrorG * 5 / 16); 
          data[i+2+width]  = data[i+2+width] +  Math.floor(quantErrorB * 5 / 16); 
           // pixel [x+1][y+1]
          data[i+4+width] = data[i+4+width] +  Math.floor(quantErrorR * 1 / 16);
          data [i+1+4+width] = data [i+1+4+width] +  Math.floor(quantErrorG * 1 / 16);
          data[i+2+4+width]  = data[i+2+4+width] +  Math.floor(quantErrorB * 1 / 16);
          
        }
        ctx.putImageData(imageData, width * 3, height * 2 );
      };
      const g = 2;
      redChannel(g);
      greenChannel(g);
      blueChannel(g);
      grayscale(g);
      random(g);
      numColors(g);
      floydStienbergDithering(g);
      randomColors(g);
      floydStienbergDitheringColors(g);
    })
  }
  //sdraw()