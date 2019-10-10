var express = require('express');
var router = express.Router();

router.get('/', async(req, res) => {
    try {
        let result = await db.any(`SELECT * FROM PLEDGING_PLEDGES;`)
        res.send(result)
    } catch (e) {
        res.status(500);
        console.log(e);
        res.send(e);
    }
})

router.post('/', async(req, res) => {
    try {
        let newPledge = req.body;
        newPledge.pledgetime = new Date().getTime();
        newPledge.isrefunded = false;

        await db.none(
            `INSERT INTO PLEDGING_PLEDGES \
            (\
              amount,\
              pledgeTime,\
              projectId,\
              userName,\
              isRefunded \
            ) \
            VALUES(\
                ${newPledge.amount}, \
                ${newPledge.pledgetime}, \
                ${newPledge.projectid},\
                '${newPledge.username}',\
                ${newPledge.isrefunded}
                );`
        );
        res.send({message: "ok"});
    } catch (e) {
        console.log(e);
        res.send({message: e.message})
    }
})

router.get('/user/:userName', async(req, res) => {
    try {
        let pledgeConfig = JSON.parse(req.query.pledgeConfig);

        let result = await db.any(
            `SELECT pledge.projectid AS projectid, pledge.amount AS amount, pledge.pledgetime AS pledgetime, pledge.username AS username, p.projectname AS projectname, pledge.isrefunded AS refunded \
            FROM PLEDGING_PLEDGES pledge \
            INNER JOIN Project p ON p.id = pledge.projectid 
            WHERE pledge.username = '${req.params.userName}' AND pledge.pledgetime BETWEEN ${pledgeConfig.startTime} AND ${pledgeConfig.endTime - 1};`
        );
        res.send(result)
    } catch (e) {
        res.status(500);
        console.log(e);
        res.send(e);
    }
})

// select users who has funded this project, shown in project view page
router.get('/leaderboard/:projectId', async(req, res) => {
    try {

        let result = await db.any(
            `SELECT pledge.username, COUNT(pledge.username) as count, COALESCE(SUM(pledge.amount), 0) AS amount
            FROM PLEDGING_PLEDGES pledge
            WHERE pledge.isRefunded=false AND pledge.projectid = ${req.params.projectId}
            GROUP BY pledge.username
            ORDER BY SUM(pledge.amount) DESC;`
        );

        res.send(result)
    } catch (e) {
        res.status(500);
        console.log(e);
        res.send(e);
    }
})

router.get('/project-stats/:projectId/pledge-graph', async(req, res) => {
    try {
        let pledgeTimeRange = JSON.parse(req.query.pledgeTimeRange);
        let startTime = pledgeTimeRange.startTime;
        let endTime = pledgeTimeRange.endTime;

        let result = await db.one(
            `SELECT COALESCE(SUM(pledge.amount), 0) AS amount
            FROM PLEDGING_PLEDGES pledge
            WHERE pledge.projectid = ${req.params.projectId} AND pledge.pledgetime >= ${startTime} AND pledge.pledgetime <= ${endTime} AND pledge.isRefunded=false;`
        );
        res.send(result)
    } catch (e) {
        res.status(500);
        console.log(e);
        res.send(e);
    }
})

// take all pledges from this project
router.get('/project/:projectId', async(req, res) => {
    try {
        let pledgeConfig = JSON.parse(req.query.pledgeConfig);

        let result = await db.any(
            `SELECT pledge.projectid AS projectid, pledge.amount AS amount, pledge.pledgetime AS pledgetime, pledge.username AS username, pledge.isrefunded AS refunded \
            FROM PLEDGING_PLEDGES pledge \
            WHERE pledge.projectid = '${req.params.projectId}' AND pledge.pledgetime BETWEEN ${pledgeConfig.startTime} AND ${pledgeConfig.endTime - 1};`
        );
        res.send(result)
    } catch (e) {
        res.status(500);
        console.log(e);
        res.send(e);
    }
})

module.exports = router;