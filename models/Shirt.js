const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShirtSchema = new Schema({
    type : String,    //ओपन भू शर्ट
    collar: String,  //लांबी
    chest: String,  // छाती
    waist: String,  // पोट
    seat: String,  // सीट
    frontWidth: String,  //सोल्डर
    firstButton: String,  //बाही लांबी
    sleeveLength: String,   //कॉलर
    shortSleeveLength: String,  //कप
   
});

module.exports = mongoose.model('Shirt', ShirtSchema);
