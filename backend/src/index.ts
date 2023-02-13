import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { Query, Resolver, buildSchema } from "type-graphql";
import "reflect-metadata";
import mongoose from "mongoose";
import { AuthResolver } from "./resolvers/Auth.resolver";
import cors from "cors";
import session from "express-session";

var FileStore = require("session-file-store")(session);

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

const main = async () => {
  const schema = await buildSchema({
    resolvers: [AuthResolver],
    authChecker: ({ context: { req, res } }) => {
      console.log(req.session);
      return !!req.session.user;
    },
  });

  const apolloServer = new ApolloServer({
    schema: schema,
    context: ({ req, res }: any) => ({ req, res }),
  });
  const app = Express();
  app.use(cors());

  app.use(
    session({
      name: "qid",
      secret: "aslkdfjoiq12312",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
      store: new FileStore(),
    })
  );

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(5000, () => {
    try {
      mongoose
        .connect(
          "mongodb+srv://sohamr:sohamr123@cluster0.csqedts.mongodb.net/gql_trial?retryWrites=true&w=majority"
        )
        .then(() => {
          console.log("CONNECTED TO DB");
        })
        .catch((err) => {
          console.log("CONNECTION TO DB FAILED!");
          console.log(err);
        });

      console.log("Server started at http://localhost:5000/graphql");
    } catch (error) {
      console.log(error);
    }
  });
};

main();
