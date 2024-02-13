import bcrypt from 'bcryptjs'

const hashData = async (data) => {
  try {
    const hashedData = await bcrypt.hash(data, 12)
    return hashedData;
  } catch (error) {
    console.log(error);
  }
}

const verifyHashedData = async (unhashed, hashed) => {
  try {
    const match = await bcrypt.compare(unhashed, hashed)
    return match
  } catch (error) {
    throw error
  }
}

export { hashData, verifyHashedData }