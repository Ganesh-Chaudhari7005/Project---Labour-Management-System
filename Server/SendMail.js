import nodemailer from "nodemailer"

async function SendMail(receiverEmail, mailSubject, mailData){
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ganeshchaudhari7005@gmail.com",
        pass: "vlau rqrx amrc nwqt",
      },
    });

    const MailOptions ={
        from : "ganeshchaudhari70052gmail.com",
        to : `${receiverEmail}`,
        subject : `${mailSubject}`,
        html : `${mailData}`
    };

     const info = await transporter.sendMail(MailOptions);
     console.log("Message sent:", info.response);
}

export default SendMail;