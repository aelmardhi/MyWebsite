const {Subscribtion} = require('../models/subscribtion');
const webPush = require('web-push');

const notifyAll = (payload) => {
  return Subscribtion.find()
    .then(subscriptions =>
      Promise.all(subscribtions.map(subscription =>
        webPush.sendNotification(
          JSON.parse(subscription.subscribtion),
          JSON.stringify( payload )|| '{title:"",body:""}'
                                 )
                                   )
            ));                     
}    

module.exports.notifyAll = notifyAll;
