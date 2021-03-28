import { MikroORM } from '@mikro-orm/core';
import { Logger } from '@overnightjs/logger';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import mikroOrmConfig from './mikro-orm.config';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  // get migrator and runs migrations up to the latest
  // shell:npx mikro-orm migration:create --run
  orm.getMigrator().up();

  // add express
  const app = express();

  // add apollo-server(need graphql schema)
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => Logger.Info('server started on localhost:4000'));

  // get object from database by mikro-orm
  // const post = await orm.em.find(Post, {});

  // creating class-constructor not database
  // const post = orm.em.create(Post, { title: 'my first post' });
  //just persist Post, will be automatically cascade persisted just run one time
  // await orm.em.persistAndFlush(post);

  // similar persist
  //Fires native insert query. Calling this has no side effects on the context (identity map)
  // await orm.em.nativeInsert(Post, { title: 'my first post' });
};

main().catch((err) => console.error(err));
