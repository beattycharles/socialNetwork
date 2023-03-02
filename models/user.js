const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^([\w]+)@([\w]+)\.([a-zA-Z]{2,9})$/,
        "Email does not meet our requirements.",
      ],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    // indicate that we want virtuals to be included with our response
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

//retrieves array length of the  user's friends

userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const user = model("user", userSchema);

module.exports = user;
