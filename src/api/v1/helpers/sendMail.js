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
                intro: "You have been invited to a meeting. Here are the details",
                table: {
                    data: [
                        {
                            key: 'Meeting Name',
                            value: meetingInfo.meetingName
                        },
                        {
                            key: 'Description',
                            value: meetingInfo.description
                        },
                        {
                            key: 'Department',
                            value: meetingInfo.department
                        },
                        {
                            key: 'Start Time',
                            value: meetingInfo.startTime
                        },
                        {
                            key: 'End Time',
                            value: meetingInfo.endTime
                        },
                        {
                            key: 'Status',
                            value: meetingInfo.status
                        },
                        {
                            key: 'Create by',
                            value: meetingInfo.userId.email
                        },
                        {
                            key: 'Room Name',
                            value: meetingInfo.roomId.roomName
                        },
                        {
                            key: 'Capacity',
                            value: meetingInfo.roomId.capacity
                        },
                        {
                            key: 'Location',
                            value: meetingInfo.roomId.location
                        }
                    ]
                },
                outro: "If you are not interested, please ignore this email",
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