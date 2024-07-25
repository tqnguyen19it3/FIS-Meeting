const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const meetingSchema = new Schema({
    meetingName: { type: String, required: [true, "Vui lòng cung cấp tên cuộc họp!"] },
    slug: { type: String, slug: 'meetingName', unique: true },
    description: { type: String, required: [true, "Vui lòng cung cấp mô tả cuộc họp!"] },
    department: { type: String, required: [true, "Vui lòng cung cấp phòng ban của bạn!"] },
    startTime: {type: Date, required: true},
    endTime: { type: Date, required: true },
    status: { type: String, required: true, default: 'scheduled' },
    roomId: { type: Schema.Types.ObjectId, ref: 'Meeting_Room' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

//add plugins
meetingSchema.plugin(slug);
meetingSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('Meeting', meetingSchema);