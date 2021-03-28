import { Logger } from '@overnightjs/logger';
import { MyContext } from 'src/types';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Post } from '../entities/Post';

@Resolver()
export class PostResolver {
  //get posts
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Array<Post>> {
    return em.find(Post, {});
  }
  // get post by ıd
  @Query(() => Post, { nullable: true })
  post(@Arg('id', () => Int) id: number, @Ctx() { em }: MyContext): Promise<Post | null> {
    return em.findOne(Post, { _id: id });
  }

  // create post
  @Mutation(() => Post)
  async createPost(@Arg('title') title: string, @Ctx() { em }: MyContext): Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  // update post
  @Mutation(() => Post, { nullable: true })
  async updatePost(@Arg('id') id: number, @Arg('title', () => String, { nullable: true }) title: string, @Ctx() { em }: MyContext): Promise<Post | null> {
    const post = await em.findOne(Post, { _id: id });
    if (!post) {
      return null;
    }

    if (typeof title !== 'undefined') {
      post.title = title;
      await em.persistAndFlush(post);
    }

    return post;
  }

  // delete post
  @Mutation(() => Boolean)
  async deletePost(@Arg('id') id: number, @Ctx() { em }: MyContext): Promise<boolean> {
    try {
      em.nativeDelete(Post, { _id: id });
      return true;
    } catch (error) {
      Logger.Err('🚀 ~ file: post.ts ~ line 50 ~ PostResolver ~ deletePost ~ error', error);
      return false;
    }
  }
}
