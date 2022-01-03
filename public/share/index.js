const filesList = document.getElementById('files');
const FRAME_LIMIT = 1024*1024*1;
const params = new URLSearchParams(location.search)
let CONNECTION_ID = params.get('c');
var peer = new Peer(undefined, {path: "/peerjs",host: "/"});    //on server
// var peer = new Peer(undefined, {path: "/peerjs",host: "/", port:5000}); //on local

let d
let conn
let di;
const showPickeronData = async (data)=>{
    if(data.initial){
        // fileHandle = await directoryHandle.getFileHandle(data.filename,{create:true});
        // await fileHandle.requestPermission({mode: 'readwrite'});
        di = new DownloadItem(data.filename,data.totalSize,async(e)=>{
            directoryHandle = await window.showDirectoryPicker();
            fileHandle = await directoryHandle.getFileHandle(data.filename,{create:true});
            
            writeable = await fileHandle.createWritable();
            size=0
            conn.send(0);
        })
        return;
    }

    await writeable.write({data:data.file,position:size,type:'write'});
    size += data.size; 
    di.update(size);
    if(data.done){
        di.done();
        await writeable.close();
        alert('recived file '+data.filename);
    }else{
        conn.send(size)
    }
}

const defaultOnData = (data)=>{
    const bytes = new Uint8Array(data.file);
    if(data.initial){
        // fileUrl = 'data:'+data.filetype+';base64,' 
        fileUrl = ''
        size=0;
        
        di = new DownloadItem(data.filename,data.totalSize)
    }
    fileUrl += bytes.reduce((a,i)=>a+String.fromCharCode(i),'')
    size += bytes.length;
    di.update(size);
    d = data
    if(data.done){
        di.done();
        if (data.filetype.includes('image')) {
            const img = document.createElement('img')
            img.src = 'data:'+data.filetype+';base64,'+btoa(fileUrl);
            document.body.prepend(img)
        }
        let a = document.createElement('a');
        a.download = data.filename
        a.rel = 'noopener'
        // a.href = URL.createObjectURL(new Blob(bytes));
        a.href = 'data:'+data.filetype+';base64,'+btoa(fileUrl);
        setTimeout(function () { URL.revokeObjectURL(a.href) }, 4E4)
        setTimeout(() => {
            a.click();
        }, 0);
    }else{
        conn.send(size);
    }
    
}

let fileHandle, writeable,directoryHandle;
let size = 0;
function Reciver(){
    CONNECTION_ID = peer.id
    peer.on('connection',con=>{
        conn = con
        if(window.showDirectoryPicker && FileSystemWritableFileStream){
            // let fileHandle, writeable;
            con.on('data',showPickeronData)  ;

        }else{

            let fileUrl = '';
            con.on('data',defaultOnData) ; 

        }
    })
    inviteButton.style.display = 'block'
    inviteButton.addEventListener('click', async () => {
        
        // let text = document.location+"?c="+CONNECTION_ID;
        let text = "use this link to send files \n"+document.location+"?c="+CONNECTION_ID;
            
        if (navigator.share) {
            navigator.share({
            title: 'share',
            text: "use this link to send files \n",
            url: window.location+"?c="+CONNECTION_ID,
            })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
        } else if (navigator.clipboard) {navigator.clipboard.writeText(text).then(function() {
                alert("Link copied to your clipboard: share with others to recieve files");
            }, function(err) {
                console.error('Async: Could not copy text: ', err);
            });
        }
    });

}

function Sender(){
    const con = peer.connect(CONNECTION_ID);
    con.on("open", (id) => {
        const input = document.createElement('input');
        input.type = 'file';
        document.getElementsByTagName('main')[0].prepend(input);
        input.classList.add('inviteButton')
        input.style.display = 'block'
        input.onchange = function(e){

            const file = event.target.files[0]
            // const blob = new Blob(event.target.files[0], { type: file.type })
            // const blob = event.target.files[0];
            let done = FRAME_LIMIT >= file.size;
            d = file
            let blob = file.slice(0,FRAME_LIMIT)
            di = new DownloadItem(file.name,file.size)
            di.update(blob.size)
            con.send({
                file: blob,
                filename: file.name,
                filetype: file.type,
                initial: true,
                done: FRAME_LIMIT >= file.size,
                size:blob.size,
                totalSize: file.size,
            });
            if(done){
                di.done();
            }
            con.on('data', data=>{
                if(data>=file.size)return;
                blob = file.slice(data,data+FRAME_LIMIT)
                let done = FRAME_LIMIT + data >= file.size;
                con.send({
                    file: blob,
                    filename: file.name,
                    filetype: file.type,
                    initial: false,
                    done: done,
                    size:blob.size,
                    totalSize: file.size,
                    });
                    if(done){
                        con.off('data');
                        di.done();
                    }
                    di.update(data+blob.size)
            });
            
        }
    })
    
    con.on("error", (err) => {
        console.log('outdated url'+err);
        let p = document.createElement('p');
        p.innerText = 'outdated url'+err
        p.style.color = 'red'
        filesList.appendChild(p)
    })
}
peer.on("open", (id) => {
    if(CONNECTION_ID){
        Sender();
    }else{
        Reciver();
    }
})


peer.on("error", (rr)=>{
    console.log(err);
    let p = document.createElement('p');
    p.innerText = err
    p.style.color = 'red'
    filesList.appendChild(p)
})

function toBytesString(s){

    return (s > 1024)?(( s> 1024 * 1024)? (s / 1024 /1024).toFixed(2) + ' MB' : (s / 1024).toFixed(2) + ' KB') : s + ' B'   ; 
}

function DownloadItem(name,totalSize,onclick = false){
    this.name = name;
    this.totalSize = totalSize;
    this.li =  document.createElement('li');
    this.title = document.createElement('h2');
    this.progress = document.createElement('div');
    this.percent = document.createElement('span');
    this.downloaded = document.createElement('span');
    this.title.classList.add('title')
    this.percent.classList.add('percent')
    this.progress.classList.add('progress')
    this.downloaded.classList.add('downloaded')
    this.title.innerText = name;
    this.percent.innerText = '0%'
    this.downloaded.innerText = '0 / ' + toBytesString(totalSize);
    this.progress.style.width = '0%'
    this.li.appendChild(this.title);
    this.li.appendChild(this.progress);
    this.li.appendChild(this.percent);
    this.li.appendChild(this.downloaded);
    if(onclick){
        this.button = document.createElement('button')
        this.button.innerText = 'start';
        this.button.onclick = (e)=>{
            onclick(e);
            this.button.style.display = 'none'
        }
        this.button.classList.add('start')
        this.li.appendChild(this.button)
    }
    filesList.appendChild(this.li);
}

DownloadItem.prototype.update = function(size){
    this.progress.style.width = Math.floor(size*100/this.totalSize)+'%'
    this.percent.innerText = Math.floor(size*100/this.totalSize)+'%'
    this.downloaded.innerText = toBytesString(size)+' / ' + toBytesString(this.totalSize);

}
DownloadItem.prototype.done = function(){
    this.li.classList.add('done');
}
