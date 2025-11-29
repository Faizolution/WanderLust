
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,

    // MUST BE "images", NOT "image"
    images: [
        {
            url: String,
            filename: String
        }
    ],

    price: {
        type: Number,
        required: true,
        min: 0
    },

    location: String,
    country: String,

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    
    documents: {
  idProof: {
    url: String,
    filename: String,
  },
  ownershipProof: {
    url: String,
    filename: String,
  },
  otherDocs: [
    {
      url: String,
      filename: String
    }
  ]
},
isVerified: {
  type: Boolean,
  default: false
}

});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

module.exports = mongoose.model("Listing", listingSchema);
