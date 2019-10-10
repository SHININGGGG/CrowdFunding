var express = require('express');
var router = express.Router();

router.get('/project/:projectid', async(req, res) => {
    try {
        let result = await db.any(`SELECT * FROM PROJECT_COMMENT WHERE projectid=${req.params.projectid};`)
        res.send(result)
    } catch (e) {
        res.status(500);
        console.log(e);
        res.send(e);
    }
})

router.post('/project/:projectid', async(req, res) => {
    try {
        let newComment = req.body
        newComment.timestamp = new Date().getTime();

        await db.none(
            `INSERT INTO PROJECT_COMMENT
            VALUES(
                '${newComment.username}',
                ${newComment.projectid},
                ${newComment.timestamp},
                '${newComment.comment}'
            );`
        );
        res.send(newComment);
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send(e)
    }
})

router.delete('/', async(req, res) => {
    try {
        let deleteComment = JSON.parse(req.query.comment)

        await db.none(
            `DELETE FROM PROJECT_COMMENT 
            WHERE 
            projectId=${deleteComment.projectid} AND username='${deleteComment.username}' AND timestamp=${deleteComment.timestamp};`
        );
        res.send(deleteComment);
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send(e)
    }
})

module.exports = router;