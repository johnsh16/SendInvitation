const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendInvite (props) {
    const msg = {
        to: props.email, // Change to your recipient
        from: 'hunter@acase.org', // Change to your verified sender
        subject: 'Your invitation to the Educational Event of 2022',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    sgMail  
        .send(msg)
        .then(() => {
            console.log('sent')
        })
        .catch((error) => {
            console.error(error)
        })
}

exports.sendInvite = sendInvite