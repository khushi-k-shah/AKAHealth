
var express = require("express");

const router = express("router");
const path = require("path");

const sendIndex = (req, res, next) => {
    res.sendFile(path.join(__dirname + "/../index.html"));
}

router.get("/", sendIndex);

module.exports = router;