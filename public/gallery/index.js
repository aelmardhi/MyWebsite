let galleryEl = document.querySelector('.gallery');
let imageFormEl = document.querySelector('.image-form');


const user =   JSON.parse(localStorage.getItem('user'));

async function Images(nextCursor){
    const article = elementFactory('article', 'gallery');

    const url = new URL('/api/images', window.location.origin)
    url.searchParams.append('limit', 20);
    if(nextCursor)
        url.searchParams.append('next_cursor', nextCursor);

    const res = await fetch(url);
    const resJson = await res.json();

    const images = resJson.images;

    images.map(({url, public_id, created_at})=>{
        const div = elementFactory('div','gallery__image');
        const img = elementFactory('img','img',undefined,undefined,{src:url, rel:`Image name is ${public_id}`});
        const h4 = elementFactory('h4', 'title', undefined, public_id);
        const span = elementFactory('span', 'date', undefined, new Date(created_at).toLocaleString());
        const copyBtn = elementFactory('button', 'btn copy_btn', undefined, 'Copy URL');
        copyBtn.onclick = async ()=>{
            try {
                await navigator.clipboard.writeText(url);
                copyBtn.textContent = 'Copied';
                await  new Promise((res)=>{ setTimeout(res,1500)});
                copyBtn.textContent = 'Copy URL';

              } catch (err) {
                console.error('Failed to copy: ', err);
                alert('Failed to copy the URL.');
              }
        }
        
        div.appendChild(img);
        div.appendChild(h4);
        div.appendChild(span);
        div.appendChild(copyBtn);

        if(user['auth-token']){
            const deleteBtn = elementFactory('button', 'btn btn-danger delete_btn',undefined,'Delete')
        deleteBtn.onclick = async () => {
            const confirmed = confirm(`Are you sure you want to delete the image: ${public_id}`);
            if (confirmed) {
              const url = new URL('/api/images', window.location.origin);
              url.searchParams.append('public_id', public_id);
          
              try {
                const res = await fetch(url, {
                  method: 'DELETE',
                  headers:{
                      'auth-token': user['auth-token'],
                  },
                });
          
                if (res.ok) {
                  const data = await res.json();
                  alert('Image deleted successfully!');
                  // Optionally remove image from UI here
                } else {
                  alert('Failed to delete image.');
                }
              } catch (err) {
                console.error('Delete request error:', err);
                alert('An error occurred while deleting the image.');
              }
            }
          };
            div.appendChild(deleteBtn);
        }
        article.appendChild(div);
    })

    if(resJson.next_cursor){
        const nextBtn = elementFactory('button', 'gallery__btn', undefined, 'Next');
        nextBtn.onclick = ()=>{
            Images(resJson.next_cursor)
        }
        article.appendChild(nextBtn)
    }


    galleryEl.replaceWith(article);
    galleryEl = article;
}


function ImageForm(){
    if(!user['auth-token'])
        return;


    const form = elementFactory('form', 'image-form', 'imageUploadForm', null, {
        method: 'POST',
        enctype: 'multipart/form-data',
        action: '/api/images/file' 
    });
    
    // Create file input
    const fileInput = elementFactory('input', null, 'imageInput', null, {
        type: 'file',
        name: 'image',
        accept: 'image/png, image/jpeg',
        style: 'display: none;' // hide the native input
    });
    
    // Create label that looks like a button
    const fileLabel = elementFactory('label', 'btn btn-primary', null, 'Choose Image', {
        for: 'imageInput'
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            fileLabel.textContent = fileInput.files[0].name;
        } else {
            fileLabel.textContent = 'Choose Image';
        }
    });
    
    // Create submit button
    const submitBtn = elementFactory('button', 'btn', null, 'Upload Image', {
        type: 'submit'
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
    
        try {
            const res = await fetch('/api/images/file', {
                method: 'POST',
                headers:{
                    'auth-token': user['auth-token'],
                },
                body: formData
            });
    
            const data = await res.json();
            alert('Upload successful! Image URL: ' + data.file.url);
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Image upload failed.');
        }
    });
    
    // Append inputs to form
    form.appendChild(fileInput);
    form.appendChild(fileLabel);
    form.appendChild(submitBtn);
    
    // Append form to the body or container
    imageFormEl.replaceWith(form)
    imageFormEl = form;
}

ImageForm();
Images();
