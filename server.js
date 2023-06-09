// must require dotenv before importing anything else
require("dotenv").config();
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT;

const startServer = async () => {
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.token),
      };
    },
  });

  await apollo.start();

  const app = express();
  app.use(logger("tiny"));
  apollo.applyMiddleware({ app });
  app.use("/static", express.static("uploads"));

  app.listen({ port: PORT }, () => {
    console.log(`🚀Server is running on http://localhost:${PORT}/graphql ✅`);
  });
};

startServer();
