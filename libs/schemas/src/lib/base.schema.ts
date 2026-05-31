import { Type } from '@nestjs/common';
import { Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';

export class BaseSchema {
  _id: ObjectId;

  @Virtual({
    get: function (this: { _id?: ObjectId }) {
      return this?._id?.toString();
    },
  })
  id: string;

  @Prop({ type: Date, default: Date.now() })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now() })
  updatedAt: Date;
}

export const createSchema = <TClass>(target: Type<TClass>): Schema<TClass> => {
  const schema = SchemaFactory.createForClass(target);

  schema.set('toJSON', { virtuals: true });
  schema.set('toObject', { virtuals: true });
  schema.set('versionKey', false);
  schema.set('timestamps', true);

  return schema;
};
