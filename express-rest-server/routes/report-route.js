var express = require('express');
var router = express.Router();

router.get('/', async (req, res) => {
    try {
        let result = await db.any(`SELECT * FROM PROJECT_REPORT;`)
        res.send(result)
    } catch (e) {
        res.status(500);
        console.log(e);
        res.send(e);
    }
})

router.get('/user/:userName', async (req, res) => {
    try {
        let result = await db.any(
            `SELECT r.projectid, r.username, r.reporttime, r.handlername, r.handledtime, r.handledescription, r.description, p.projectname 
            FROM PROJECT_REPORT r, PROJECT p
            WHERE r.userName='${req.params.userName}' AND r.projectid=p.id;`
        )
        res.send(result)
    } catch (e) {
        res.status(500);
        console.log(e);
        res.send(e);
    }
})

router.post('/', async (req, res) => {
    try {
        let newReport = req.body;
        newReport.reporttime = new Date().getTime();

        await db.none(
            `INSERT INTO PROJECT_REPORT ( \
                userName, \
                projectId, \
                description, \
                reportTime \
            ) VALUES ( \
                '${newReport.username}',
                ${newReport.projectid},
                '${newReport.description}',
                ${newReport.reporttime}
            )`
        );
        res.send({message: "ok"});
    } catch (e) {
        console.log(e);
        //res.status(500);
        res.send({message: e.message})
    }
})

module.exports = router;