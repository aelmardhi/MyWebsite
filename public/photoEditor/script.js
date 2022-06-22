//var img = new Image();   // Create new img element
//img.src = '/home/aelmardhi/Pictures/Screenshot from [EgyBest].Young.Sheldon.S02E12.WEB-DL.1080p.x264.mp4.png'; // Set source path
const width = 480;
const height = 270;
const margin = 50;
const fontsize = 32;

var imageData

// aplly code to show controls
document.getElementById('brightnessBtn').onclick = function(e){
  document.querySelectorAll('.panel div').forEach(
    d => d.style.transform = 'translateY(0%)')
  document.querySelector('.brightness').style.transform = 'translateY(-100%)'
}
document.getElementById('contrastBtn').onclick = function(e){
  document.querySelectorAll('.panel div').forEach(
    d => d.style.transform = 'translateY(0%)')
  document.querySelector('.contrast').style.transform = 'translateY(-100%)'
}
document.getElementById('saturateBtn').onclick = function(e){
  document.querySelectorAll('.panel div').forEach(
    d => d.style.transform = 'translateY(0%)')
  document.querySelector('.saturate').style.transform = 'translateY(-100%)'
}
document.getElementById('highlightsBtn').onclick = function(e){
  document.querySelectorAll('.panel div').forEach(
    d => d.style.transform = 'translateY(0%)')
  document.querySelector('.highlights').style.transform = 'translateY(-100%)'
}

var im
var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  
const input = document.querySelector('input[type="file"]');
input.onchange = function draw(e) {
  event.preventDefault()
    
      im = event.target.files[0]
      createImageBitmap(event.target.files[0]).then(function(img) {
        im = img
      canvas.width = img.width
      canvas.height = img.height
      if(img.width > img.height){
        canvas.style.height = 'unset'
      }else{
        canvas.style.width = 'unset'
      }
      ctx.drawImage(img, 0, 0, img.width ,img.height);
      //img.style.display = 'none';
      
      imageData = ctx.getImageData(0,0,img.width,img.height);
    })
  

  }

document.querySelector('.panel').querySelectorAll('input[type="range"]').forEach(range => range.onchange = function(e){
    const filters = {
      brightness: Math.floor(document.querySelector('.brightness input').value),
      contrast: Math.floor(document.querySelector('.contrast input').value),
      saturate: Math.floor(document.querySelector('.saturate input').value),
      highlights: Math.floor(document.querySelector('.highlights input').value),
    }
    console.log(filters);
    var imgData =  new ImageData(imageData.width, imageData.height)
    
    let data = new Int16Array( imageData.data.length);
    for(let  i=0;i<imageData.data.length;i++){
      data[i] = imageData.data[i]
    }
    data = brightness(data,filters.brightness)
    data = contrast(data,filters.contrast)
    data = saturate(data,filters.saturate)
    data = highlights(data,filters.highlights)
    // console.log(data)
    // ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%)  `
    
    imgData.data.set(data)
    ctx.putImageData(imgData,0,0)
    // ctx.drawImage(im, 0, 0);
  })

  function brightness(data,b){
    b-=100
    for (let i = 0; i < data.length; i+=4) {
      data[i] = data[i]+b;
      data[i+1] = data[i+1]+b;
      data[i+2] = data[i+2]+b;
          }
    return data
  }

  function contrast(data,c){
    c-=100
    const factor = (259 * (c +255)) / (255 * (259 -c))
    for (let i = 0; i < data.length; i+=4) {
      data[i] = factor* (data[i]-128)+128;
      data[i+1] = factor *(data[i+1]-128) + 128;
      data[i+2] = factor *(data[i+2]-128)+128;
          }
    return data
  } 
  
  function gamma(data,g){
    const factor = 1/((g+100)/200)
    for (let i = 0; i < data.length; i+=4) {
      data[i] =Math.floor( 255* (data[i]/255) ** factor);
      data[i+1] =Math.floor( 255 *(data[i+1]/255) ** factor);
      data[i+2] =Math.floor( 255 *(data[i+2]/ 255)** factor);
          }
    return data
} 

  function saturate(data,g){
    g /= 100;
    for (let i = 0; i < data.length; i+=4) {
		let v = RGBToHSL(data[i], data[i+1], data[i+2]);
		v = HSLToRGB(v.h,v.s*g,v.l);
      data[i] =v.r;
      data[i+1] = v.g;
      data[i+2] = v.b;
          }
    return data
} 
  function highlights(data,g){
    g /= 100;
	g = 2-g;
    for (let i = 0; i < data.length; i+=4) {
		let v = RGBToHSL(data[i], data[i+1], data[i+2]);
		if(v.l>50)
			v.l = (((v.l/100-.5)**g*100) %101)+50
		v = HSLToRGB(v.h,v.s,v.l);
      data[i] =v.r;
      data[i+1] = v.g;
      data[i+2] = v.b;
          }
    return data
} 










ConvolutionFilter = function (srcImageData, matrixX, matrixY, matrix, divisor, bias, preserveAlpha, clamp, color, alpha) {
	var srcPixels = srcImageData.data,
		srcWidth = srcImageData.width,
		srcHeight = srcImageData.height,
		srcLength = srcPixels.length,
		dstImageData = this.utils.createImageData(srcWidth, srcHeight),
		dstPixels = dstImageData.data;

	divisor = divisor || 1;
	bias = bias || 0;

	// default true
	(preserveAlpha !== false) && (preserveAlpha = true);
	(clamp !== false) && (clamp = true);

	color = color || 0;
	alpha = alpha || 0;

	var index = 0,
		rows = matrixX >> 1,
		cols = matrixY >> 1,
		clampR = color >> 16 & 0xFF,
		clampG = color >> 8 & 0xFF,
		clampB = color & 0xFF,
		clampA = alpha * 0xFF;

	for (var y = 0; y < srcHeight; y += 1) {
		for (var x = 0; x < srcWidth; x += 1, index += 4) {
			var r = 0,
				g = 0,
				b = 0,
				a = 0,
				replace = false,
				mIndex = 0,
				v;

			for (var row = -rows; row <= rows; row += 1) {
				var rowIndex = y + row,
					offset;

				if (0 <= rowIndex && rowIndex < srcHeight) {
					offset = rowIndex * srcWidth;
				} else if (clamp) {
					offset = y * srcWidth;
				} else {
					replace = true;
				}

				for (var col = -cols; col <= cols; col += 1) {
					var m = matrix[mIndex++];

					if (m !== 0) {
						var colIndex = x + col;

						if (!(0 <= colIndex && colIndex < srcWidth)) {
							if (clamp) {
								colIndex = x;
							} else {
								replace = true;
							}
						}

						if (replace) {
							r += m * clampR;
							g += m * clampG;
							b += m * clampB;
							a += m * clampA;
						} else {
							var p = (offset + colIndex) << 2;
							r += m * srcPixels[p];
							g += m * srcPixels[p + 1];
							b += m * srcPixels[p + 2];
							a += m * srcPixels[p + 3];
						}
					}
				}
			}

			dstPixels[index] = (v = r / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
			dstPixels[index + 1] = (v = g / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
			dstPixels[index + 2] = (v = b / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
			dstPixels[index + 3] = preserveAlpha ? srcPixels[index + 3] : (v = a / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
		}
	}

	return dstImageData;
};



function HSLToRGB(h,s,l) {
  // Must be fractions of 1
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;
	  
	  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;  
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return {r,g,b}
}

function RGBToHSL(r,g,b) {
  // Make r, g, and b fractions of 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;
	   // Calculate hue
  // No difference
  if (delta == 0)
    h = 0;
  // Red is max
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax == g)
    h = (b - r) / delta + 2;
  // Blue is max
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);
    
  // Make negative hues positive behind 360°
  if (h < 0)
      h += 360;
   // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    
  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return {h,s,l};
	  }
