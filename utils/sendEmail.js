import nodemailer from 'nodemailer'
import 'dotenv/config'

const transporter = nodemailer.createTransport({
  host: process.env.HOST_EMAIL,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  }
})

transporter.verify((error, success) => {
  if (error) {
    console.log(error)
  } else {
      console.log('Ready for messages')
      console.log(success)
    }
})

const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions)
    return;
  } catch (error) {
    throw(error)
  }
}

export default sendEmail
