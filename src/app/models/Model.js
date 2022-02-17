var mongoose = require('mongoose');

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const Model = new Schema({
    // id: ObjectId,
    name: { type: String, required: true, unique: true},
    description: { type: String, default: ''},
    image: { type: String, default: ''},
    videoId: { type: String, required: true}
}, {
    timestamps: true
});

module.exports = mongoose.model('Model', Model);