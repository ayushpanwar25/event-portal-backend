import mongoose from "mongoose";

const Faculty = mongoose.model(
  "Faculty",
  new mongoose.Schema(
    {
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
    },
    {
      collection: "faculty",
    }
  )
);

export default Faculty;
