const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

const meetingParticipantSchema = new Schema({
    meetingId: { type: Schema.Types.ObjectId, ref: 'Meeting' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

//add plugins
meetingParticipantSchema.plugin(slug);
meetingParticipantSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('Meeting_Participant', meetingParticipantSchema);