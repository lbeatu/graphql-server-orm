import { MikroORM } from '@mikro-orm/core';
import path from 'path';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import { User } from './entities/User';

//__dirname getting current project location
export default {
  migrations: {
    path: path.join(__dirname, './migrations'), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
  },
  entities: [Post, User],
  dbName: 'lireddit',
  type: 'postgresql',
  user: 'postgres',
  password: '123456',
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
