const nodemailer = require("nodemailer");
const mailGen = require("mailgen");

const sendMailToMetingParticipant = async (toMail, meetingInfo, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_ACCOUNT,
                pass: process.env.GMAIL_PASSWORD
            }
        });

        const mailGenerator = new mailGen({
            theme: "cerberus",
            product: {
                name: "FIS-MEETING",
                logo: "https://scontent.fsgn2-4.fna.fbcdn.net/v/t31.18172-8/13040864_911999408913469_8018614780934785094_o.jpg?_nc_cat=101&ccb=1-7&_nc_sid=f798df&_nc_eui2=AeE0LJuUTcGMFr7ODOqAKSoimk46L1Er-liaTjovUSv6WPoJH3GQ1qHBMMUkcucxALLT9TqyllMP8NePGItAENP2&_nc_ohc=AvFFx1XIpcMQ7kNvgEz8Gbw&_nc_ht=scontent.fsgn2-4.fna&oh=00_AYCRMBgCi-Hi-huoxRW5KTDjZ1BDXm5AMc3JOAv75HLaug&oe=66BD84BE",
                link: "http://localhost:3030/"
            },
        });
    
        const emailContent = {
            body: {
                email: toMail,
                intro: "Bạn đã được mời đến một cuộc họp. Đây là những thông tin chi tiết",
                table: {
                    data: [
                        {
                            key: 'Tên cuộc họp',
                            value: meetingInfo.meetingName
                        },
                        {
                            key: 'Mô tả',
                            value: meetingInfo.description
                        },
                        {
                            key: 'Được tạo bởi',
                            value: meetingInfo.userId.email
                        },
                        {
                            key: 'Phòng ban',
                            value: meetingInfo.department
                        },
                        {
                            key: 'Thời gian bắt đầu',
                            value: meetingInfo.startTime
                        },
                        {
                            key: 'Thời gian kết thúc',
                            value: meetingInfo.endTime
                        },
                        {
                            key: 'Trạng thái',
                            value: meetingInfo.status
                        },
                        {
                            key: 'Phòng họp',
                            value: meetingInfo.roomId.roomName
                        },
                        {
                            key: 'Sức chứa',
                            value: meetingInfo.roomId.capacity
                        },
                        {
                            key: 'Vị trí',
                            value: meetingInfo.roomId.location
                        }
                    ]
                },
                outro: "Nếu bạn không quan tâm, vui lòng bỏ qua email này",
            },
        };
    
        const mailOptions = {
            from: "noreply@gmail.com",
            to: toMail,
            subject: subject,
            text: html,
            html: mailGenerator.generate(emailContent),
        };
    
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("Failed to send email", error);
        throw error;
    }
};

module.exports = { 
    sendMailToMetingParticipant
}