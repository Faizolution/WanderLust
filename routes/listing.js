// const express = require("express");
// const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync.js");
// const Listing = require("../models/listing.js");
// const { isLoggedIn , isOwner , validateListing } = require("../middleware.js");
// const listingController = require("../controllers/listings.js");
// const multer  = require('multer');
// const {storage} = require("../cloudConfig.js");
// const upload = multer({ storage });

// router.route("/")
// // Index Route
//   .get(wrapAsync(listingController.index))   

// // Create route
//   .post(
//      isLoggedIn,
//     //  validateListing,
//     upload.single('listing[image]'),
//      validateListing,
//      wrapAsync(listingController.createListing)
// );

// // New Route
// router.route("/new")
//  .get( isLoggedIn, listingController.renderNewForm );

// router.route("/:id")
//  // Show route
//   .get(wrapAsync(listingController.showListing))

//   //Update Route
//   .put(
//   isLoggedIn,
//   isOwner,
//   upload.single('listing[images]'),
//   validateListing,
//   wrapAsync(listingController.updateListing))

//   // delete route
//   .delete(
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.destroyListing));


// //Edit Route
//   router.get("/:id/edit", 
//     isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.renderEditForm));


// module.exports = router;








const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


//updation
router.route("/")
  // Index Route
  .get(wrapAsync(listingController.index))

  // Create Route
  .post(
    isLoggedIn,
    upload.fields([
      { name: "listing[images]", maxCount: 5 },        // ✅ fixed plural
      { name: "documents[idProof]", maxCount: 1 },
      { name: "documents[ownershipProof]", maxCount: 1 },
      { name: "documents[otherDocs]", maxCount: 5 }
    ]),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// New Route
router.route("/new")
  .get(isLoggedIn, listingController.renderNewForm);

router.route("/:id")
  // Show route
  .get(wrapAsync(listingController.showListing))

  // Update route
  .put(
    isLoggedIn,
    isOwner,
    upload.array("listing[images]"),   // ← FIXED
    validateListing,
    wrapAsync(listingController.updateListing)
  )

  // Delete Route
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);


module.exports = router;

