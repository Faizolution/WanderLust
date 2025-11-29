
const Listing = require("../models/listing");

// INDEX ROUTE
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// SHOW ROUTE
module.exports.showListing = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// CREATE ROUTE
module.exports.createListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;


  // Handle main listing images
if (req.files["listing[images]"]) {
  newListing.images = req.files["listing[images]"].map(f => ({
    url: f.path,
    filename: f.filename,
  }));
} else {
  newListing.images = [{
    url: "https://res.cloudinary.com/db7xftttb/image/upload/v1760205238/explorer_DEV/jrbpiqqzqc7gf1kgp3dy.jpg",
    filename: "explorer_DEV/default"
  }];
}

  // Updates for documents
  if (req.files["listing[image]"]) {
    newListing.image = req.files["listing[image]"].map(f => ({
      url: f.path,
      filename: f.filename,
    }));
  }

  if (req.files["documents[idProof]"]) {
    newListing.documents.idProof = {
      url: req.files["documents[idProof]"][0].path,
      filename: req.files["documents[idProof]"][0].filename,
    };
  }

  if (req.files["documents[ownershipProof]"]) {
    newListing.documents.ownershipProof = {
      url: req.files["documents[ownershipProof]"][0].path,
      filename: req.files["documents[ownershipProof]"][0].filename,
    };
  }

  if (req.files["documents[otherDocs]"]) {
    newListing.documents.otherDocs = req.files["documents[otherDocs]"].map(f => ({
      url: f.path,
      filename: f.filename
    }));
  }

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect(`/listings/${newListing._id}`);
};

// EDIT FORM
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.images[0].url.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// UPDATE ROUTE
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // if (req.files && req.files.length > 0) {
  //   listing.images = req.files.map(f => ({
  //     url: f.path,
  //     filename: f.filename
  //   }));
  //   await listing.save();
  // }

  if (req.files["listing[images]"]) {
  listing.images = req.files["listing[images]"].map(f => ({
    url: f.path,
    filename: f.filename
  }));
  await listing.save();
}

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// DELETE ROUTE
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
