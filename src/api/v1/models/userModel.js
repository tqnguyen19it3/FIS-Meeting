const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: [true, "Vui lòng cung cấp tên!"], minLength: 6, maxLength: 24 },
    email: { type: String, required: [true, "Vui lòng cung cấp email!"], unique: true },
    password: { type: String, require: [true, "Vui lòng cung cấp mật khẩu!"], minLength: 6 },
    passwordConfirm: {
        type: String,
        require: [true, "Vui lòng xác nhận lại mật khẩu!"],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "Mật khẩu của bạn không khớp!",
        },
    },
    role: { type: String, default: 'R&D' },
    phoneNumber: { type: String },
    dob: { type: Date},
    gender: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);