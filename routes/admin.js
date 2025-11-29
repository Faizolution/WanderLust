const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const { isLoggedIn, isAdmin } = require("../middleware");

// Show all unverified listings
router.get("/pending", isLoggedIn, isAdmin, async (req, res) => {
    const pendingListings = await Listing.find({ isVerified: false });
    res.render("admin/pending.ejs", { pendingListings });
});

// Approve a listing
router.post("/verify/:id", isLoggedIn, isAdmin, async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { isVerified: true });
    req.flash("success", "Listing verified successfully!");
    res.redirect("/admin/pending");
});

// Reject a listing
router.post("/reject/:id", isLoggedIn, isAdmin, async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("error", "Listing rejected and removed.");
    res.redirect("/admin/pending");
});



module.exports = router;
