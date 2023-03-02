const {Schema, model, Types} = require('mongoose');


const userSchema = new Schema({
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
    match: [ //regex to validate email is an email within site parameters
      /^([\w]+)@([\w]+)\.([a-zA-Z]{2,9})$/,
      'Email does not meet our requirements.',
    ],
  },
  thoughts: [ //grabs thoughts by id from thought collection
    {
        type: Schema.Types.ObjectId,
        ref: 'thought',
    },
  ],
  friends: [ //self-referencing to find the user's friends
    {
     type: Schema.Types.ObjectId,
     ref: 'user',   
    }
  ]
  },
  {
    // Here we are indicating that we want virtuals to be included with our response, overriding the default behavior
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

//retrieves array length of the  user's friends

userSchema.virtual("friendCount").get(function() {
  return this.friends.length;
});

const user = model('user', userSchema);

module.exports = user;

