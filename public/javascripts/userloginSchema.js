import mongoose from 'mongoose';

const loginSchema = new mongoose.Schema({
  phoneNumber: {
    type: Number,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  expire: {
    type: Date,
    required: true,
  },
  time_remaining: {
    type: Number,
    default: 0,
  },
});
//const loginData = mongoose.model('purchases', loginSchema);

export { loginData };
