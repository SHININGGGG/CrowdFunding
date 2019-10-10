var express = require('express');
var router = express.Router();

router.get('/search', async(req, res) => {
    try {
        let searchTerm = req.query.searchname;
        let display = req.query.display;

        let whereQuery = ""
        if(display !== "ALL") {
            whereQuery = `AND userrole = '${display}'`
        }

        let result = await db.any(
            `SELECT * FROM USER_ACC WHERE userName LIKE '%${searchTerm}%' ${whereQuery};`
        )
        
        res.send(result)
    } catch (e) {
        res.status(500)
        console.log(e)
        res.send(e)
    }
})

router.get('/leaderboard', async(req, res) => {
    try {

        let result = await db.any(
            `SELECT pledge.username, COUNT(pledge.username) ,COALESCE(SUM(pledge.amount), 0) AS amount
            FROM PLEDGING_PLEDGES pledge
            WHERE pledge.isRefunded=false
            GROUP BY pledge.username
            ORDER BY SUM(pledge.amount) DESC
            LIMIT 10;`
        );

        res.send(result)
    } catch (e) {
        res.status(500);
        console.log(e);
        res.send(e);
    }
})

router.get('/:username', async(req, res) => {
    try {
        let result = await db.any(
            `SELECT * FROM USER_ACC WHERE userName='${req.params.username}';`
        )
        res.send(result)
    } catch (e) {
        res.status(500)
        console.log(e)
        res.send(e)
    }
})

router.get('/', async(req, res) => {
    try {
        let result = await db.any(`SELECT * FROM USER_ACC;`)
        res.send(result)
    } catch (e) {
        res.status(500)
        console.log(e)
        res.send(e)
    }
})

router.post('/', async(req, res) => {
    try {
        let newUser = req.body

        await db.none(
            `INSERT INTO USER_ACC VALUES('${newUser.userrole}', '${newUser.username}', '${newUser.hashedpassword}');`
        );
        res.send(newUser)
    } catch (e) {
        console.log(e)
        res.status(500)
        res.send(e)
    }
})

router.put('/:username', async(req, res) => {
    try {
        //Testing
        let updatedUser = req.body

        let result = await db.any(
            `UPDATE USER_ACC \
            SET userRole='${updatedUser.userrole}', hashedPassword='${updatedUser.hashedpassword}' \
            WHERE userName='${req.params.username}';`
        )
        res.send(result)
    } catch (e) {
        console.log(e)
        res.status(500)
        res.send(e)
    }
})

router.delete('/:username', async(req, res) => {
    try {
        let result = await db.any(
            `DELETE FROM USER_ACC WHERE userName='${req.params.username}';`
        )
        res.send(result)
    } catch (e) {
        console.log(e)
        res.status(500)
        res.send(e)
    }
})

router.post('/login', async(req, res) => {

    let loginUser = req.body;

    try {
        let result = await db.one(
            `SELECT * FROM USER_ACC WHERE userName='${loginUser.username}' AND hashedpassword='${loginUser.hashedpassword}';`
        )
        res.send(result)
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send(e);
    }
})

router.get('/user-stats/:userName/pledge-dist', async(req, res) => {

    try {
        let pledgeConfig = JSON.parse(req.query.pledgeConfig);

        //Query 1 -- Select Pledge amt per tagName per project
        let query1 = `
        SELECT (CASE WHEN tag.tagName IS NULL THEN 'NO TAG' ELSE tag.tagName END) as tagName, SUM(pledges.amount) as amt, tag.projectid as projectid
        FROM PLEDGING_PLEDGES pledges
        INNER JOIN PROJECT project ON pledges.projectid = project.id
        LEFT OUTER JOIN TAGGED_TO_TAG tag ON project.id = tag.projectid
        WHERE pledges.userName='${req.params.userName}' AND pledges.isRefunded=false AND pledges.pledgetime >= ${pledgeConfig.startTime} AND pledges.pledgetime < ${pledgeConfig.endTime - 1}
        GROUP BY tag.tagName, tag.projectid
        `

        //Query 2 -- Select Project and their number of tags attached to the project
        let query2 = `
        SELECT project.id as projectid, COUNT(*) as count
        FROM PROJECT project 
        INNER JOIN TAGGED_TO_TAG tag ON tag.projectid = project.id
        GROUP BY project.id
        `

        //Combine the two queries
        let combinedQuery = `
        SELECT q1.tagName as tagName, (CASE WHEN q2.count IS NULL THEN q1.amt ELSE (CAST( FLOOR(q1.amt / q2.count) AS INTEGER)) END) as sum
        FROM (${query1}) as q1 
        LEFT OUTER JOIN (${query2}) as q2 ON q1.projectid = q2.projectid
        `

        //Group by tagName from the combined query
        let groupbyQuery = `
        SELECT cq.tagName as tagName, SUM(cq.sum) as sum
        FROM (${combinedQuery}) as cq
        GROUP BY cq.tagName;
        `

        let result = await db.any(groupbyQuery)

        res.send(result);
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send(e);
    }
});

router.get('/user-stats/:userName/pledge-graph', async(req, res) => {
    try {

        let pledgeTimeRange = JSON.parse(req.query.pledgeTimeRange);
        let startTime = pledgeTimeRange.startTime;
        let endTime = pledgeTimeRange.endTime;

        let result = await db.one(
            `SELECT COALESCE(SUM(pledge.amount), 0) AS amount
            FROM PLEDGING_PLEDGES pledge
            WHERE pledge.username = '${req.params.userName}' AND pledge.pledgetime >= ${startTime} AND pledge.pledgetime < ${endTime} AND pledge.isRefunded=false;`
        );
        res.send(result)
    } catch (e) {
        res.status(500);
        console.log(e);
        res.send(e);
    }
})


router.get('/user-stats/:userName/project-pledge-dist', async(req, res) => {

    try {

        //Query 1 -- Select Tags that have raised money and their amount raised on the project
        let query1 = `
        SELECT DISTINCT tag.tagName as tagName, project.id as projectid, SUM(pledge.amount) as amount
        FROM PROJECT project
        INNER JOIN TAGGED_TO_TAG tag ON tag.projectid = project.id
        INNER JOIN PLEDGING_PLEDGES pledge ON pledge.projectid = project.id AND pledge.isrefunded = false
        WHERE project.projectowner = '${req.params.userName}' AND EXISTS (SELECT * FROM PLEDGING_PLEDGES WHERE projectId = project.id)
        GROUP BY project.id, tag.tagName
        `

        //Query 2 -- Select the number of tags attached to each project that has raised money
        let query2 = `
        SELECT project.id as projectid, COUNT(*) as tagCount
        FROM PROJECT project
        INNER JOIN TAGGED_TO_TAG tag ON tag.projectid = project.id
        WHERE project.projectowner = '${req.params.userName}' AND EXISTS (SELECT * FROM PLEDGING_PLEDGES WHERE projectId = project.id)
        GROUP BY project.id 
        `

        //Combine the two queries
        let combinedQuery = `
        SELECT q1.tagName, FLOOR(q1.amount / q2.tagCount) as amt
        FROM
        (${query1}) as q1
        INNER JOIN (${query2}) as q2 ON q1.projectid = q2.projectid
        `

        //Group by tagName from the combined query
        let groupbyQuery = `
        SELECT cq.tagName, SUM(cq.amt)
        FROM
        (${combinedQuery}) as cq
        GROUP BY cq.tagName;
        `

        let result = await db.any(groupbyQuery)

        res.send(result);
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send(e);
    }
});

module.exports = router;