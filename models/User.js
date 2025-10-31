const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  phone: {
    type: String,
  },
    role: {
    type: String,
    enum: ['user', 'admin'], 
    default: 'user',
  },

  address: {
    type: String,
  },
  image: {
    type: String, 
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },

  
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      name: {
        type: String, 
      },
      price: {
        type: Number, 
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
    },
  ],
}, { timestamps: true });


userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  if (obj.isAdmin) delete obj.cart;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
