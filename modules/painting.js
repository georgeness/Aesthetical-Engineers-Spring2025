import mongoose from 'mongoose';

const PaintingSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  dimensions: { 
    type: String, 
    required: true 
  },
  medium: { 
    type: String, 
    required: true 
  },
  notes: { 
    type: String, 
    default: '' 
  },
  price: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field on save
PaintingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Export model
const Painting = mongoose.models.Painting || mongoose.model('Painting', PaintingSchema);

export default Painting; 