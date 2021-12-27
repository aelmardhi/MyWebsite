const { date } = require('@hapi/joi');
const mongoose = require('mongoose');
let model;
const subscribtionSchema = new mongoose.Schema({
    subscribtion: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date('2000-10-10')
    }
});

try {
    model = mongoose.model('Subscribtion');
}catch(err) {
    model = mongoose.model('Subscribtion', subscribtionSchema);
}


const maxDate = Date.now() -1000*60*60*24*7 // 1000*60*60*24*7
async function deleteOld(){
    try{
       let m =  await model.deleteMany({date:{$lte: maxDate}}).exec()
    }catch(e){
        console.log(e)
    }
}
module.exports.Subscribtion = model;
module.exports.deleteOld = deleteOld;
