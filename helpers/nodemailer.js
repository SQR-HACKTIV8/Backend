const nodemailer = require("nodemailer");

async function sendEmailNodemailer(email, link, OrderId, username) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sqreforestation@gmail.com",
        pass: "xsiugvwllapnmtgc"
      },
    });

    const sendEmail = await transporter.sendMail({
      from: "noreply",
      to: email,
      subject: `SQR Invoice Order - ${OrderId}`,
      text: "Hi " + username + ", \n\nTerima kasih sudah percaya dengan SQR sebagai pilihan untuk Anda berkurban. \nAnda tidak saja memberi manfaat untuk sesama tetapi juga memberi manfaat untuk lingkungan.\n\nBerikut adalah invoice Anda : " + link + "\n\nBest Regards, \nSQR Family",
    });
    console.log(">>> Success sending email to " + email + "<<<")

  } catch (error) {
    console.error("Error:", error.message, "<<< nodemailer");
  }
}

module.exports = sendEmailNodemailer;
