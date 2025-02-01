import { Schema, model, models, Types } from 'mongoose';

export interface IProperty {
  _id: string;
  owner: Types.ObjectId | string;
  name: string;
  type: string;
  description: string;
  location: {
    street?: string;
    city?: string;
    state?: string;
    zipcode?: string;
  };
  beds: number;
  baths: number;
  square_feet: number;
  amenities: string[];
  rates?: {
    nightly?: number;
    weekly?: number;
    monthly?: number;
  };
  seller_info?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  images: string[];
  is_featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const propertySchema = new Schema<IProperty>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required'],
  },
  name: {
    type: String,
    required: [true, 'Property name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['Apartment', 'Condo', 'House', 'Townhouse']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [50, 'Description must be at least 50 characters']
  },
  location: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipcode: { type: String, trim: true }
  },
  beds: {
    type: Number,
    required: [true, 'Number of beds is required'],
    min: [1, 'At least 1 bed required']
  },
  baths: {
    type: Number,
    required: [true, 'Number of baths is required'],
    min: [1, 'At least 1 bath required']
  },
  square_feet: {
    type: Number,
    required: [true, 'Square footage is required'],
    min: [100, 'Minimum 100 sqft']
  },
  amenities: {
    type: [String],
    required: [true, 'At least one amenity is required'],
    validate: {
      validator: (arr: string[]) => arr.length > 0,
      message: 'At least one amenity is required'
    }
  },
  rates: {
    nightly: { type: Number, min: 0 },
    weekly: { type: Number, min: 0 },
    monthly: { type: Number, min: 0 }
  },
  seller_info: {
    name: { type: String, trim: true },
    email: { 
      type: String,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    },
    phone: { type: String, trim: true }
  },
  images: {
    type: [String],
    validate: {
      validator: (arr: string[]) => arr.length >= 1,
      message: 'At least one image is required'
    }
  },
  is_featured: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: (doc, ret) => {
      ret._id = ret._id.toString();
      delete ret.__v;
      return ret;
    }
  }
});

propertySchema.virtual('location.formattedAddress').get(function(this: IProperty) {
  return `${this.location.street}, ${this.location.city}, ${this.location.state} ${this.location.zipcode}`;
});

const Property = models.Property || model<IProperty>('Property', propertySchema);

export default Property;