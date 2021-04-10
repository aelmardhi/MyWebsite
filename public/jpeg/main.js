

var name = '';
const rangeInput = document.getElementById('rangeInput');
const imagEle = document.getElementById('img');
const addFile = document.getElementById('addFile');
const downloadLink = document.getElementById('downloadLink');
var originalImageData;
function fileChange(){
    name = event.target.files[0].name;
    event.preventDefault();
    imagEle.classList.remove('hide');
    addFile.classList.add('hide');
    downloadLink.classList.remove('hide');
   /* createImageBitmap(event.target.files[0]).then(function(img) {
        originalImageData = getImageDataFromImage(img);
        draw(50);
})*/
    event.target.files[0].arrayBuffer().then(buffer => {
        originalImageData = imageData = decode(buffer,{useTArray:true});
        draw(10)
        rangeInput.value = 10;
    })
}
function draw(quality) {
    if(!quality)quality = event.target.value;
    //console.log(quality);
    data = encode(originalImageData,quality);
    //console.log(data);
    const src =  'data:image/jpeg;base64,' + btoa(data.data.reduce((a,i)=>a+String.fromCharCode(i),''));
    downloadLink.download = name.split('.')[0]+'('+quality+').jpg';
    downloadLink.href = src
    imagEle.src= src;
    //console.log(imageData)

}