import OTP from "../models/otp.js";
// import generateOTP from "../utils/generateOTP.js";
import generateOTP from '../utils/generateOTP.js'
import sendEmail from "../utils/sendEmail.js";
import { hashData, verifyHashedData } from "../utils/hashData.js";
import "dotenv/config";

export const sendOTPController = async (req, res) => {
  try {
    const { email, subject, message, duration=1 } = req.body;

    if (!(email && subject && message)) {
      throw Error("Provide values for email, subject, message");
    }

    // clear any old record
    await OTP.deleteOne({ email });

    //generate pin
    const generatedOTP = await generateOTP();

    // send email
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject:subject,
      text: `<p>${message}</p>
      <p style="color:tomato; font-size:25px; letter-spacing:2px;">
        <b>${generatedOTP}</b>
      </p>
      <p>This code 
        <b>expires in ${duration} hour(s)</b>.
      </p>`,
    };

    await sendEmail(mailOptions);

    //save otp record
    const hashedOTP = await hashData(generatedOTP);
    const newOTP = await new OTP({
      email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 * +duration,
    });
    
    const createdOTP = await newOTP.save();
    res.status(200).json(createdOTP);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const verifyOTPController = async (req, res) => {
  try {
    let { email, otp } = req.body;
    if (!(email && otp)) {
      throw Error("Provide values for email, otp");
    }
    // ensure otp record exists
    const matchedOTPRecord = await OTP.findOne({ email });
    if (!matchedOTPRecord) {
      throw Error("No otp record found");
    }
    // checking for expired otp
    const { expiresAt } = matchedOTPRecord;
    if (expiresAt < Date.now()) {
      await OTP.deleteOne({ email });
      throw Error("OTP has expired. Request for a new one");
    }
    const hashedOTP = matchedOTPRecord.otp;
    const validOTP = await verifyHashedData(otp, hashedOTP);
    res.status(200).json({ valid: validOTP });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
