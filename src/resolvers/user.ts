import argon2 from 'argon2';
import { MyContext } from 'src/types';
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from 'type-graphql';
import { User } from '../entities/User';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field(() => String, { nullable: true })
  field?: string;

  @Field(() => String, { nullable: true })
  code?: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  // add user (register)
  @Mutation(() => UserResponse)
  async register(@Arg('options') options: UsernamePasswordInput, @Ctx() { em }: MyContext): Promise<UserResponse> {
    if (options.username.length <= 2)
      return {
        errors: [
          {
            field: 'username',
            message: 'length must be greater than 2',
          },
        ],
      };
    if (options.password.length <= 3)
      return {
        errors: [
          {
            field: 'password',
            message: 'length must be greater than 3',
          },
        ],
      };

    //hash password by argon2 npm package
    const hashedPassword = await argon2.hash(options.password);

    const user = em.create(User, { username: options.username, password: hashedPassword });
    try {
      await em.persistAndFlush(user);

      return { user };
    } catch (error) {
      return { errors: [{ code: error.code, message: error.detail }] };
    }
  }

  // login process
  @Mutation(() => UserResponse)
  async login(@Arg('options') options: UsernamePasswordInput, @Ctx() { em }: MyContext): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user)
      return {
        errors: [{ field: 'username', message: "that username doesn't exist" }],
      };
    const valid = await argon2.verify(user.password, options.password);
    if (!valid)
      return {
        errors: [{ field: 'password', message: 'inccorrect password' }],
      };

    return { user };
  }
}
