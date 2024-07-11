const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: [true, "Please provide a name!"], minLength: 6, maxLength: 24 },
    email: { type: String, required: [true, "Please provide a email!"], unique: true },
    password: { type: String, require: [true, "Please provide a password!"], minLength: 6 },
    passwordConfirm: {
        type: String,
        require: [true, "Please confirm your password!"],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords are not the same!",
        },
    },
    role: { type: String, default: 'Member' },
    phoneNumber: { type: String },
    dob: { type: Date},
    gender: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);