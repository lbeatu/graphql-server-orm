import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

@ObjectType() // define graphql of model
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ type: 'date', default: 'NOW()' })
  createdAt: Date = new Date();

  @Field()
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field() // include as graphql schema if delete declaration , expose this field
  @Property({ type: 'text', unique: true })
  username!: string;

  @Property({ type: 'text' })
  password!: string;
}
