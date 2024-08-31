const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PantSchema = new Schema({
    type : String,    //प्लेट नो प्लेट
    waistband: String, //लांबी
    seat: String, //कंबर
    thigh: String, // सीट
    knee: String, //किस्तक
    cuff: String, //मांडी
    crotchFull: String, // गुडगा
    crotchFrontRise: String,  //बॉटम

    
});

module.exports = mongoose.model('Pant', PantSchema);
