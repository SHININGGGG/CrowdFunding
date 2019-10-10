var express = require('express');
var router = express.Router();

router.get('/', async(req, res) => {
    try {
        let result = await db.any('SELECT * FROM LOGGING ORDER BY timestamp DESC;');
        res.send(result)
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send(e)
    }
})

module.exports = router;