const getToken = async (userId) => {
  try {
    console.log( userId);
    const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    return token;
  } catch (error) {
    console.log(error);
  }
}

export default getToken;