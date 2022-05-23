const { Schema, model, mongoose } = require('mongoose');



const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

userSchema
    .virtual('friendCount')
    .get(function () {
        return this.friends.length;
    })

const User = model('user', userSchema);


// userSchema.path('email').validate(async (email) => {
//     const emailCount = await mongoose.models.User.countDocuments({ email })
//     return !emailCount
// }, 'Email is already being used')

module.exports = User;