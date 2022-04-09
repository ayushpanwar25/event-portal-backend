import mongoose from "mongoose";

const Event = mongoose.model(
  "Event",
  new mongoose.Schema(
    {
      clubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      club: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      registrations: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      visible: {
        type: Boolean,
        default: false,
      },
      proposalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Proposal",
      },
      reportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
      },
    },
    {
      collection: "events",
    }
  )
);

export default Event;
