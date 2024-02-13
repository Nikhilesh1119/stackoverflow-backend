import  mongoose from 'mongoose'

const OTPSchema = mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true, 
  },
  otp: String,
  createdAt: Date,
  expiresAt: Date,
})

const OTP = mongoose.model('OTP', OTPSchema)

export default OTP