const nodeMailer = require ('nodemailer');
const emailid = ['chaithru2002@gmail.com'];
const sendMail = async (emailid,otp) => {
    const transporter = nodeMailer.createTransport({
        host : "smtp.gmail.com",
        port : 465,
        secure : true,
        auth:{
            user : "chaithru2002@gmail.com",
            pass : "rtgb dwot fkyt bgth",
        },
    });
    const info = await transporter.sendMail({
        from : '"nodemailer"<chaithru2002@gmail.com>',
        to : emailid,
        subject : "Otp",
        html : `<h2>${otp}</h2>`,
    })
}
module.exports=sendMail;