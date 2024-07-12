const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const meetingRoomSchema = new Schema({
    roomName: { type: String, required: [true, "Please provide a room name!"] },
    slug: { type: String, slug: 'roomName', unique: true },
    capacity: { type: Number, required: true },
    location: { type: String, required: true },
    status: { type: Boolean, required: true },
}, { timestamps: true });

//add plugins
meetingRoomSchema.plugin(slug);
meetingRoomSchema.plugin(mongooseDelete, { deletedAt: true });

module.exports = mongoose.model('Meeting_Room', meetingRoomSchema);