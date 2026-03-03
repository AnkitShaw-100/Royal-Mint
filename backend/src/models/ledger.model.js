import mongoose from "mongoose";
import immutableLedgerPlugin from "../plugins/immutable-ledger.plugin.js";

const ledgerSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Ledger entry must be associated with an account"],
      index: true,
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transaction",
      required: [true, "Ledger entry must be associated with a transaction"],
      index: true,
    },
    direction: {
      type: String,
      enum: {
        values: ["DEBIT", "CREDIT"],
        message: "Direction can be either DEBIT or CREDIT",
      },
      required: [true, "Direction is required"],
    },
    amount: {
      type: Number,
      min: [0, "Amount cannot be negative"],
      required: [true, "Amount is required"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      default: "INR",
    },
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

ledgerSchema.plugin(immutableLedgerPlugin);

const ledgerModel = mongoose.model("ledger", ledgerSchema);

export default ledgerModel;
