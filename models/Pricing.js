const mongoose=require("mongoose");

const pricingCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  basePricePerDay: {
    type: Number,
    required: true
  },

  commissionPercentage: {
    type: Number,
    default: 10
  },

  description: {
    type: String
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true })
module.exports=mongoose.model("Pricing",pricingCategorySchema)
