const express = require('express');
const router = express.Router();

router.get('/demo', (req, res, next) => {
    // TODO

    return res.json({message: "demo api endpoint works"})
})

module.exports = router