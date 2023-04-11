import { Schema } from 'bridge-mongo';

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    age: Number,
    password: String,
  },
  { timestamps: true }
);
