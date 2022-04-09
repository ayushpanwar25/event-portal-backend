import mongoose from "mongoose";

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      regNo: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      events: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event",
        },
      ],
    },
    {
      collection: "user",
    }
  )
);

export default User;
