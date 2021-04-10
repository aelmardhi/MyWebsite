

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
        draw(50)
        rangeInput.value = 50;
    })
}
function draw(quality) {
    if(!quality)quality = event.target.value;
    //console.log(quality);
    data = encode(originalImageData,quality);
    //console.log(data);
    downloadLink.download = name.split('.')[0]+'('+quality+').jpg';
    downloadLink.href = 'data:image/jpeg;base64,' + btoa(String.fromCharCode(...data.data));
    imagEle.src= 'data:image/jpeg;base64,' + btoa(String.fromCharCode(...data.data));
    //imageData = decode(data.data,{useTArray:true});
    //console.log(imageData)

}