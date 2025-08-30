const nodemailer=require('nodemailer');

module.exports.sendMail=async function sendMail(str,data){

    const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "sahil.ayush012@gmail.com",
        pass: "mffybywiqgjbfxqn",
    },
    });

    var osubject,otext,ohtml;
    if(str=="signup"){
        osubject=`thank you for signing up ${data.name}`;
        ohtml=`<h1>Hi ${data.name},welcome to our application.</h1>
        <p>We are glad that you have chosen our application for your needs.</p>
        here are your details:
        Name:${data.name}   
        email:${data.email}`;
    }
    else if(str=="resetpassword"){
        osubject=`Reset your password`;
        ohtml=`<h1>Hi ${data.name}</h1>
        <p>We got a request to reset your password.</p>
        your link : ${data.resetpasswordlink}`;
    }


    const info = await transporter.sendMail({
    from: '"food app" <sahil.ayush@gmail.com>',
    to: data.email,
    subject: osubject,
 // plain‑text body
    html: ohtml, // HTML body
  });
  console.log("Message sent: %s", info.messageId);
}