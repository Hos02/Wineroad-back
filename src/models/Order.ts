import mongoose from "mongoose";

export const ORDER_STATUSES = ["pending", "confirmed", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

const orderSchema = new mongoose.Schema(
  {
    tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
    userName: { type: String, required: true, maxlength: 255 },
    userEmail: { type: String, required: true, maxlength: 255 },
    numberOfPeople: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "confirmed",
      required: true,
    },
  },
  { timestamps: true }
);

export type OrderAttrs = {
  tour: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  numberOfPeople: number;
  totalPrice: number;
  status: OrderStatus;
};

export const OrderModel = mongoose.model<OrderAttrs>("Order", orderSchema);
