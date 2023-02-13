import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
@modelOptions({
    schemaOptions: {
        collection: "Users",
    },
})
export class UserSchema {
    @Field(() => String)
    readonly _id!: ObjectId["toString"]

    @Field(() => String)
    @prop({ required: true })
    firstName!: String;

    @Field(() => String)
    @prop({ required: true })
    lastName!: String;

    @Field(() => String)
    @prop({ required: true, unique: true })
    email!: String;

    @prop({ required: true })
    password!: String;
}

export const UserModel = getModelForClass(UserSchema);
