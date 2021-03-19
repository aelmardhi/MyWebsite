//var img = new Image();   // Create new img element
//img.src = '/home/aelmardhi/Pictures/Screenshot from [EgyBest].Young.Sheldon.S02E12.WEB-DL.1080p.x264.mp4.png'; // Set source path
const width = 480;
const height = 270;
const margin = 50;
const fontsize = 32;

var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var canvas2 = document.getElementById('canvas2');
  var ctx2 = canvas2.getContext('2d');
  var canvas3 = document.getElementById('canvas3');
  var ctx3 = canvas3.getContext('2d');
  
//const input = document.querySelector('input');
function draw(e) {
  event.preventDefault()
    document.getElementById('ordered-label').style.display = 'block';
    ctx.font = fontsize+'px serif';
    ctx.strokeStyle = 'red';
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
        ctx.putImageData(imageData, 0, height + margin);
      };
      var ordered = function(g) {
        const M = [[ 0*16, 8*16,   2*16, 10*16],
                   [ 12*16, 4*16, 14*16,  6*16],
                   [ 3*16, 11*16,  1*16,  9*16],
                   [ 15*16, 7*16, 13*16,  5*16]];
        var imageData = ctx.getImageData(0,0,width,height);
        var data = imageData.data;
        var newImageData = ctx2.createImageData( 4*width, 4*height);
        var newData = newImageData.data;
        for (var i = 0; i < data.length; i += 4) {
          var avg = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3 );
          var y = Math.floor(i/4/width)*16  *4*width;
          for (var j = 0; j < 4; j += 1) {
            var x = ((i/4)%width)*4*4;
            for (var k = 0; k < 4; k += 1) {
              //console.log(avg,M[j][k]);
              newData[x+y]     = (avg > M[j][k])? 255: 0; // red
              newData[x+y + 1] = (avg > M[j][k])? 255: 0; // green
              newData[x+y + 2] = (avg > M[j][k])? 255: 0; // blue
              newData[x+y+3] = 255;
              x+=4;
            }  
            y += width*16;
          }
        }
        ctx2.putImageData(newImageData, 0, 0);
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
        ctx.putImageData(imageData, width, height + margin);
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
        ctx.putImageData(imageData, width * 3, (height  + margin ) );
      };



      var numColors = function(g) {
        var imageData = ctx.getImageData(0,0,width, height);
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
          data[i]     = Math.floor(data[i]*g/ 255)/(g-1)*255 ; // red
          data[i + 1] = Math.floor(data[i+1]*g/ 255)/(g-1)*255; // green
          data[i + 2] = Math.floor(data[i+2]*g/ 255)/(g-1)*255; // blue
        }
        ctx.putImageData(imageData, 0, (height  + margin )*2);
      };
      var orderedColors = function(g) {
        const M = [[ 0*16, 8*16,   2*16, 10*16],
                   [ 12*16, 4*16, 14*16,  6*16],
                   [ 3*16, 11*16,  1*16,  9*16],
                   [ 15*16, 7*16, 13*16,  5*16]];
        var imageData = ctx.getImageData(0,0,width,height);
        var data = imageData.data;
        var newImageData = ctx3.createImageData( 4*width, 4*height);
        var newData = newImageData.data;
        for (var i = 0; i < data.length; i += 4) {
          var y = Math.floor(i/4/width)*16  *4*width;
          for (var j = 0; j < 4; j += 1) {
            var x = ((i/4)%width)*4*4;
            for (var k = 0; k < 4; k += 1) {
              //console.log(avg,M[j][k]);
              newData[x+y]     = (data[i] > M[j][k])? 255: 0; // red
              newData[x+y + 1] = (data[i+1] > M[j][k])? 255: 0; // green
              newData[x+y + 2] = (data[i+2] > M[j][k])? 255: 0; // blue
              newData[x+y+3] = 255;
              x+=4;
            }  
            y += width*16;
          }
        }
        ctx3.putImageData(newImageData, 0, 0);
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
        ctx.putImageData(imageData, width, (height  + margin )*2);
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
        ctx.putImageData(imageData, width * 3, (height  + margin )*2);
      };
      const g = 2;
      ctx.fillText('ORIGINAL',0,height+fontsize);
      redChannel(g);
      ctx.fillText('RED',width,height+fontsize);
      greenChannel(g);
      ctx.fillText('GREEN',width *2,height+fontsize);
      blueChannel(g);
      ctx.fillText('BLUE',width*3,height+fontsize);
      grayscale(g);
      ctx.fillText('GRAY',0,2*height+margin+fontsize);
      random(g);
      ctx.fillText('RANDOM',width,2*height+margin+fontsize);
      ordered(g);
      ctx.fillText('ORDERED',2*width,2*height+margin+fontsize);
      floydStienbergDithering(g);
      ctx.fillText('FLOYD-STIENBERG',width*3,2*height+margin+fontsize);
      numColors(g);
      ctx.fillText('COLORS',0,3*height+2*margin+fontsize);
      randomColors(g);
      ctx.fillText('RANDOM COLORS',width,3*height+2*margin+fontsize);
      orderedColors(g);
      ctx.fillText('ORDERED COLORS',2*width,3*height+2*margin+fontsize);
      floydStienbergDitheringColors(g);
      ctx.fillText('FLOYD COLORS',width*3,3*height+2*margin+fontsize);


      ctx.drawImage(canvas2,2*width,height+margin,width,height);
      ctx.drawImage(canvas3,2*width,2*(height+margin),width,height);

      //dra don hape
      ctx.beginPath();
      ctx.moveTo(2.5*width, 2*height  +50);
      ctx.lineTo(2.5*width+100, 2*height -50);
      ctx.lineTo(2.5*width+50, 2*height -50);
      ctx.lineTo(2.5*width+50, 2*height -150);
      ctx.lineTo(2.5*width-50, 2*height -150);
      ctx.lineTo(2.5*width-50, 2*height -50);
      ctx.lineTo(2.5*width-100, 2*height -50);
      ctx.fill(); 

      ctx.beginPath();
      ctx.moveTo(2.5*width, 3*height + margin +50);
      ctx.lineTo(2.5*width+100, 3*height + margin-50);
      ctx.lineTo(2.5*width+50, 3*height + margin-50);
      ctx.lineTo(2.5*width+50, 3*height + margin-150);
      ctx.lineTo(2.5*width-50, 3*height + margin-150);
      ctx.lineTo(2.5*width-50, 3*height + margin-50);
      ctx.lineTo(2.5*width-100, 3*height + margin-50);
      ctx.fill(); 
    })
  }
  //sdraw()