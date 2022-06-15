
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    name: {
        type:String,
        required:true
    },
    image: {
        data:Buffer,
        contentType:String
    }
});

const Image = mongoose.model('imageModel', ImageSchema);

module.exports  = Image;
