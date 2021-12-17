//var img = new Image();   // Create new img element
//img.src = '/home/aelmardhi/Pictures/Screenshot from [EgyBest].Young.Sheldon.S02E12.WEB-DL.1080p.x264.mp4.png'; // Set source path
const width = 480;
const height = 270;
const margin = 50;
const fontsize = 32;
let ctrlForm = document.querySelector('.controls form')
let saveAt = ctrlForm.querySelector('#saveAt');
let add1 = ctrlForm.querySelector('#add1');
let add2 = ctrlForm.querySelector('#add2');
let add1Scale = ctrlForm.querySelector('#add1Scale');
let add2Scale = ctrlForm.querySelector('#add2Scale');
let mul1 = ctrlForm.querySelector('#mul1');
let mul2 = ctrlForm.querySelector('#mul2');
let fltImg = ctrlForm.querySelector('#fltImg');
let flt00 = ctrlForm.querySelector('#flt00');
let flt01 = ctrlForm.querySelector('#flt01');
let flt02 = ctrlForm.querySelector('#flt02');
let flt10 = ctrlForm.querySelector('#flt10');
let flt11 = ctrlForm.querySelector('#flt11');
let flt12 = ctrlForm.querySelector('#flt12');
let flt20 = ctrlForm.querySelector('#flt20');
let flt21 = ctrlForm.querySelector('#flt21');
let flt22 = ctrlForm.querySelector('#flt22');
let fltGain = ctrlForm.querySelector('#fltGain');
let fltScale = ctrlForm.querySelector('#fltScale');
let fltScale2 = ctrlForm.querySelector('#fltScale2');
let id;
var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  
//const input = document.querySelector('input');
function draw(e) {
  event.preventDefault()
    
    //var img = new Image(event.target.files[0]);
    //console.log(img)
  //  img.src = '///home/aelmardhi/Pictures/Screenshot from [EgyBest].Young.Sheldon.S02E12.WEB-DL.1080p.x264.mp4.png'; // Set source path
 // img.crossOrigin = "Anonymous";
      createImageBitmap(event.target.files[0]).then(function(img) {
      ctx.drawImage(img, 0, 0, width ,height);
      //img.style.display = 'none';
      var imageData = ctx.getImageData(0,0,width,height);

      id = imageData
      let filter= [
        [1,0,-1],
        [2,0,-2],
        [1,0,-1]
      ]
      let filter2= [
        [1,2,1],
        [0,0,0],
        [-1,-2,-1]
      ]
      let filter3= [
        [0,0,0],
        [0,2,1],
        [0,1,1]
      ]
      let filter4= [
        [1,1,1],
        [1,1,1],
        [1,1,1]
      ]
      var newImageData3 = applyFilter(imageData,filter4,0,1/9);
      newImageData3 = applyFilter(newImageData3,filter4,0,1/9);
      newImageData3 = applyFilter(newImageData3,filter4,0,1/9);
      newImageData3 = applyFilter(newImageData3,filter4,0,1/9);
      newImageData3 = applyFilter(newImageData3,filter4,0,1/9);
      newImageData3 = applyFilter(newImageData3,filter4,0,1/9);
      newImageData3 = applyFilter(newImageData3,filter4,0,1/9);
      ctx.putImageData(newImageData3, 0, 2*height + 2*margin);
      var newImageData= applyFilter(imageData,filter,0,1);
      ctx.putImageData(newImageData, 0, height + margin);

      var newImageData2= applyFilter(imageData,filter2,0,1);
      ctx.putImageData(newImageData2, width, height + margin);

      newImageData = addImageData(newImageData,newImageData2,0.5,0.5)
      ctx.putImageData(newImageData, width*2, height + margin);
      newImageData = applyFilter(newImageData,filter4,0,1/9);
      newImageData = mulImageData(imageData,newImageData)
       newImageData= applyFilter(newImageData,8,0,1/4);
       newImageData = limit(newImageData,0,50)
      ctx.putImageData(newImageData, width*3, height + margin);
      newImageData3 = addImageData(newImageData3,newImageData,1,1);
      ctx.putImageData(newImageData3, width, height*2 + 2*margin);
      newImageData = addImageData(imageData,newImageData,1,1)
      // newImageData = addImageData(newImageData3,newImageData,.5,.5)
      ctx.putImageData(newImageData, 3*width, 0);
      
      newImageData = addImageData(newImageData,newImageData3,1,-1)
      ctx.putImageData(newImageData, 2*width, 0);
      newImageData = addImageData(newImageData,imageData,1,1)
      ctx.putImageData(newImageData, 1*width, 0);

      document.body.classList.add('showControls')
    })
  }
  //sdraw()


  function applyFilter(imageData, filter, added, mul){
    if(!imageData)return;
    if(!filter)return imageData;
    else if(typeof filter === 'number')filter = [[0,0,0],[0,filter,0],[0,0,0]];
    if(!added) added = [0,0,0];
    if(typeof added === 'number') added = [added,added,added];
    if(!mul)mul=1;
    const width = imageData.width;
    const height = imageData.height;
    let data = imageData.data;
    let newImageData = new ImageData(width, height);
    let newData = new Int16Array( newImageData.data.length);
    
    for (var i = 0; i < data.length; i += 4) {
      //second row;
      newData[i] = data[i] * filter[1][1]* mul + added[0];
      newData[i+1] = data[i+1] * filter[1][1] * mul+ added[1];
      newData[i+2] = data[i+2] * filter[1][1]* mul+ added [2];
      newData[i+3] = data[i+3] 
      if(((i/4)%width)>=1){
        newData[i] += data[i-4] * filter[1][0]* mul;
        newData[i+1] += data[i-4+1] * filter[1][0]* mul;
        newData[i+2] += data[i-4+2] * filter[1][0]* mul;
      }
      if(((i/4)%width)<=(width-2)){
        newData[i] += data[i+4] * filter[1][2]* mul;
        newData[i+1] += data[i+4+1] * filter[1][2]* mul;
        newData[i+2] += data[i+4+2] * filter[1][2]* mul;
      }
      //first row
      if(((i/4/width)%height)>=1){
          newData[i] += data[i-width*4] * filter[0][1]* mul;
          newData[i+1] += data[i-width*4+1] * filter[0][1]* mul;
          newData[i+2] += data[i-width*4+2] * filter[0][1]* mul;
        if(((i/4)%width)>=1){
          newData[i] += data[i-width*4-4] * filter[0][0]* mul;
          newData[i+1] += data[i-width*4-4+1] * filter[0][0]* mul;
          newData[i+2] += data[i-width*4-4+2] * filter[0][0]* mul;
        }
        if(((i/4)%width)<=(width-2)){
          newData[i] += data[i-width*4+4] * filter[0][2]* mul;
          newData[i+1] += data[i-width*4+4+1] * filter[0][2]* mul;
          newData[i+2] += data[i-width*4+4+2] * filter[0][2]* mul;
        }
      }
      //third row
      if(((i/4/width)%height)<=(height-2)){
          newData[i] += data[i+width*4] * filter[2][1]* mul;
          newData[i+1] += data[i+width*4+1] * filter[2][1]* mul;
          newData[i+2] += data[i+width*4+2] * filter[2][1]* mul;
        if(((i/4)%width)>=1){
          newData[i] += data[i+width*4-4] * filter[2][0]* mul;
          newData[i+1] += data[i+width*4-4+1] * filter[2][0]* mul;
          newData[i+2] += data[i+width*4-4+2] * filter[2][0]* mul;
        }
        if(((i/4)%width)<=(width-2)){
          newData[i] += data[i+width*4+4] * filter[2][2]* mul;
          newData[i+1] += data[i+width*4+4+1] * filter[2][2]* mul;
          newData[i+2] += data[i+width*4+4+2] * filter[2][2]* mul;
        }
      }
      
    }
    for(let i =0;i<newData.length;i++){
      newImageData.data[i] = newData[i]
    }
   
    return newImageData;
  }

  function addImageData(imageData1, imageData2, scale1 = 1, scale2 = 1){
    if( imageData1.width !== imageData2.width || imageData1.height != imageData2.height) return new Error('size does not match');
    let newImageData = new ImageData(imageData2.width, imageData2.height);
    for (var i = 0; i < imageData1.data.length; i += 1) {
      newImageData.data[i] = (imageData1.data[i]*scale1+imageData2.data[i]*scale2);
      if(i%4=== 3)newImageData.data[i]=255;
    }
    return newImageData;
  }
  function mulImageData(imageData1, imageData2){
    if( imageData1.width !== imageData2.width || imageData1.height != imageData2.height) return new Error('size does not match');
    let newImageData = new ImageData(imageData2.width, imageData2.height);
    for (var i = 0; i < imageData1.data.length; i += 1) {
      newImageData.data[i] = imageData1.data[i]/256*imageData2.data[i];
    }
    return newImageData;
  }
  function limit(imageData, min, max){
    let data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      //second row;
      data[i] = data[i]>max?0:data[i]<min?0:data[i];
      data[i+1] = data[i+1]>max?0:data[i+1]<min?0:data[i+1];
      data[i+2] = data[i+2]>max?0:data[i+2]<min?0:data[i+2];
      data[i+3] = data[i+3] 
    }
    return imageData;
  }


  document.getElementById('addBtn').addEventListener('click',(e)=>{
    document.body.classList.add('showAdd');
    document.body.classList.remove('showMul','showFlt');
    e.preventDefault();
  })
  document.getElementById('mulBtn').addEventListener('click',(e)=>{
    document.body.classList.add('showMul');
    document.body.classList.remove('showAdd','showFlt');
    e.preventDefault();
  })
  document.getElementById('fltBtn').addEventListener('click',(e)=>{
    document.body.classList.add('showFlt');
    document.body.classList.remove('showMul','showAdd');
    e.preventDefault();
  })

  function getImageDataByIndex(index){
    index--;
    return ctx.getImageData(width*(index%4),Math.floor(index/4)*(height+margin),width,height);
  }
  function putImageDataByIndex(data,index){
    index --;
    return ctx.putImageData(data,width*(index%4),Math.floor(index/4)*(height+margin));
  }

  document.getElementById('form').addEventListener('submit',(e)=>{
    e.preventDefault();
    console.log(e);
    saveAtValue = saveAt.value;
    if(document.body.classList.contains('showAdd')){
      let = add1Data = getImageDataByIndex(add1.value);
      let = add2Data = getImageDataByIndex(add2.value);
      let addedData = addImageData(add1Data,add2Data,add1Scale.value,add2Scale.value);
      putImageDataByIndex(addedData,saveAtValue);
    }
    if(document.body.classList.contains('showMul')){
      let = mul1Data = getImageDataByIndex(mul1.value);
      let = mul2Data = getImageDataByIndex(mul2.value);
      let multipliedData = mulImageData(mul1Data,mul2Data);
      putImageDataByIndex(multipliedData,saveAtValue);
    }
    if(document.body.classList.contains('showFlt')){
      let = fltData = getImageDataByIndex(fltImg.value);
      let filter = [
        [flt00.value,flt01.value,flt02.value],
        [flt10.value,flt11.value,flt12.value],
        [flt20.value,flt21.value,flt22.value],
      ]

      let filteredData = applyFilter(fltData,filter,fltGain.value*1,fltScale.value/fltScale2.value);
      putImageDataByIndex(filteredData,saveAtValue);
    }
  })