import client from "../../client";
import bcrypt from "bcrypt";;

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                username,
              },
              {
                email,
              },
            ],
          },
        });
        if (existingUser) {
          throw new Error("This username/password is already taken.");
        }
        const uglyPassword = await bcrypt.hash(password, 10);
        const newUser = await client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: uglyPassword,
          },
        });
        if (newUser) {
          return {
            ok: true,
          }
        }
      } catch (e) {
        console.log(e);
        return {
          ok: false,
          error: "Can't create account."
        }
      }
    },
  },
};