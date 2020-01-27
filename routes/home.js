const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    //res.send({"wow": "hello world"})
    res.render('index', {title:"my Express App", message:"Hello..."});
});

module.exports = router;