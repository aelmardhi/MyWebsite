# chato
app and website I created to  build tools I occationaly use
a pwa

> hosted on
> https://chato.onrender.com/
> https://dardasha.herokuapp.com/

* video chat
* file share
* file uploader
* http downloader
* dip tasks and image editor
* ytl
* games

this project uses Cloudinary for storing media and files and Mongo Atlas for NoSql database

## Installation and Running

### Requirements
 You need NodeJs v16.16.0 or higher . and NPM v8 or higher visit https://nodejs.org/ for more info and installation

 ### Steps to run
1. clone the repo
2. run  `npm install` to install dependancies
3. run `npm start` to run the server
4. visit https://localhost:5000 

### .env file 
You need to create .env file int the base code folder. It is a normal text file named `.env` in which you define enviromental variables. The file should be in the format 
```
VARIABLE_1 = VALUE
VARIABLE_1 = VALUE   
```

## Environmental Variables
this is the list of environmental variables used by the app. Their  values can be set either as system (or user) environmental variables, or using the `.env` file.

1. **DB_CONNECT**: MongoDB URI.
2. **TOKEN_SECRET**: JWT secret.
3. **CLOUD_NAME**: Cloudenary cloud name.
4. **API_KEY**: Cloudenary API key.
5. **API_SECRET**: Cloudinary API secret.
6. **TELEGRAM_TOKEN** Telegram bot api token.
7. **USE_LOCALHOST_HTTPS**: a boolean if true will use local file certificate for https.
8. **VAPID_PUBLIC_KEY**: WebPush public key.
9. **VAPID_PUBLIC_KEY**: WebPush private Key.
10. **PORT**: http port number to use.



