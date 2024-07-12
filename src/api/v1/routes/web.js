// CHILD ROUTE
const authRoute = require('./api/authRoute');
const userRoute = require('./api/userRoute');
const meetingRoomRoute = require('./api/meetingRoomRoute');


function initRoutes(app) {

    //SITE
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    //AUTH
    app.use('/api/v1/auth', authRoute);

    //USER
    app.use('/api/v1/user', userRoute);

    //MEETING ROOM
    app.use('/api/v1/meeting-room', meetingRoomRoute);

}

module.exports = initRoutes
