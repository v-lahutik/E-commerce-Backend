import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be a positive number']
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock must be a positive number']
    },
    image: {
      type: String,
      required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, // Change this line
        ref: 'Category', 
        required: true,
    } 
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
