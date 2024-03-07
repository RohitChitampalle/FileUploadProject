const twilio = require('twilio');


const accountSid = 'AC7197167fa01a0f7add1d307057ace6da';
const authToken = '9924929e550b5359191ac9e42406246b';
const twilioPhoneNumber = '+12315295857';

const client = twilio(accountSid, authToken);


const smsGenerator = (phoneNumber, code) => {


if (!phoneNumber) {
    return ({
        error: 'Phone number is required.'
    });
}

// Send SMS using Twilio
client.messages
    .create({
        body: `Your verification code is: ${code}`,
        from: twilioPhoneNumber,
        to: phoneNumber
    })
    .then((message) => {
        console.log(message.sid);
        return ({
            success: true,
            code
        });
    })
    .catch((error) => {
        console.error(error);
        return ({
            error: 'Failed to send SMS.'
        });
    });

}

module.exports = smsGenerator;