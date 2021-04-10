var jpeg = require('jpeg-js');
var fs = require('fs');
var width = 20,
    height = 18;
  var frameData = new Buffer(width * height * 4);
  var i = 0;
  while (i < frameData.length) {
    frameData[i++] = 0xff; // red
    frameData[i++] = 0x00; // green
    frameData[i++] = 0x00; // blue
    frameData[i++] = 0xff; // alpha - ignored in JPEGs
  }
  var rawImageData = {
    data: frameData,
    width: width,
    height: height,
  };
  //var jpegData = fs.readFileSync('s.jpg');
    //var rawImageData = jpeg.decode(jpegData);
  var jpegImageData = jpeg.encode(rawImageData, 100);
  console.log(jpegImageData.data.length)
  var b64 =Buffer.from(jpegImageData.data).toString('hex')
  fs.writeFileSync('s2.jpg', jpegImageData.data);
  fs.writeFileSync('b64.txt', b64);