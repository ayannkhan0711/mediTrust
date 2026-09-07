import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Name!"],
    },
    description: {
      type: String,
      required: [true, "Please Enter Description!"],
    },
    price: {
      type: Number,
      required: [true, "Please Enter Price!"],
    },
    stock: {
      type: Number,
      required: [true, "Please Enter Stock!"],
    },
    expiresOn: {
      type: Date,
      required: [true, "Please Enter Expiry Date!"],
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;