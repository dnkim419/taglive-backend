import client from "../../client";

export default {
  Query: {
    searchUsers: async (_, { keyword, page }) => {
      const users = await client.user.findMany({
        where: {
          username: {
            startsWith: keyword.toLowerCase(),
          }
        },
        take: 5,
        skip: (page - 1) * 5
      });
      return {
        ok: true,
        users,
      }
    }
  }
};
