import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
    userName: { type: String, required: true, maxlength: 255 },
    userEmail: { type: String, required: true, maxlength: 255 },
    numberOfPeople: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

export type OrderAttrs = {
  tour: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  numberOfPeople: number;
  totalPrice: number;
};

export const OrderModel = mongoose.model<OrderAttrs>("Order", orderSchema);
