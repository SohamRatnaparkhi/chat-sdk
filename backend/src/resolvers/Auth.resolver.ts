import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UserModel, UserSchema } from "../models/Users.model";
import { MyContext } from "../types/context.type";
import store from "store";

@Resolver()
export class AuthResolver {
  @Authorized()
  @Query(() => String)
  async hello() {
    return "hello world";
  }

  @Mutation(() => UserSchema)
  async register(
    @Arg("firstName") firstName: String,
    @Arg("lastName") lastName: String,
    @Arg("email") email: String,
    @Arg("password") password: String,
    @Ctx() ctx: MyContext
  ): Promise<UserSchema> {
    const newUser = await UserModel.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });

    await newUser.save();
    return newUser;
  }

  @Mutation(() => UserSchema, { nullable: true })
  async login(
    @Arg("email") email: String,
    @Arg("password") password: String,
    @Ctx() ctx: MyContext
  ): Promise<UserSchema | null> {
    try {
      const user = await UserModel.findOne({
        email,
        password,
      });
      if (user) {
        ctx.req.session.user = user.id;
        console.log(ctx.req.session);
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
