import userModel from "../models/user.model.js";

const createUser = async ({ firstname, lastname, email, password }) => {
  try {
    if (!firstname || !password || !email) {
      throw new Error("Missing required fields");
    }

    const user = await userModel.create({
      fullName: {
        firstName: firstname,
        lastName: lastname,
      },
      email,
      password,
    });

    return user;
  } catch (error) {
    throw new Error(error);
  }
};

export default { createUser };