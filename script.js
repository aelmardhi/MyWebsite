const axios = require('axios')
//import('axios.min.js')


function login(){
    axios.post('http://localhost:3000/api/user/login', {
        'username': 'aladin',
        'password': '12901290'
    })
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
} ;
login();