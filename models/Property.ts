import { Schema, model, models } from 'mongoose';

const propertySchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Property name is required'],
  },
  type: {
    type: String,
    required: [true, 'Property type is required'],
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
  },
  location: {
    street: String,
    city: String,
    state: String,
    zipcode: String,
  },
  beds: {
    type: Number,
    required: Number,
  },
  baths: {
    type: Number,
    required: Number,
  },
  square_feet: {
    type: Number,
    required: Number,
  },
  amenities: {
    type: [String],
    required: [true, 'Property amenities are required'],
  },
  rates: {
    nightly: Number,
    weekly: Number,
    monthly: Number,
  },
  seller_info: {
    name: String,
    email: String,
    phone: String,
  },
  images: [{ type: String }],
  is_featured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true, toJSON: { virtuals: true } });

const Property = models.Property || model('Property', propertySchema);

export default Property;