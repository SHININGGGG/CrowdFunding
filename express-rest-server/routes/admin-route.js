var express = require('express');
var router = express.Router();

router.get('/', async (req, res) => {
    try {
        let whereQuery = "WHERE r.projectid = p.id "

        if (req.query.name) {
            whereQuery += `AND p.projectname LIKE '%${req.query.name}%'`
        }

        if (req.query.isResolved) {
            if (req.query.isResolved === "true") {
                whereQuery += `AND r.handlername IS NOT NULL`
            }
            else if (req.query.isResolved === "false") {
                whereQuery += `AND r.handlername IS NULL`
            }
        }

        let result = await db.any(
            `SELECT * 
            FROM PROJECT_REPORT r, PROJECT p 
            ${whereQuery};`
        );

        res.send(result)
    } catch (e) {
        res.status(500);
        console.log(e);
        res.send(e);
    }
})

router.post('/freeze', async (req, res) => {
    try {
        let newFreeze = req.body
        await db.none(
            `UPDATE PROJECT
            SET isbanned = 'true'
            WHERE id = ${newFreeze.projectid};`
        );
        res.send(newFreeze);
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send(e)
    }
})

router.post('/refund', async (req, res) => {
    try {
        let newRefund = req.body

        await db.none(
            `UPDATE pledge \
            SET isrefunded = 'true' \
            WHERE projectid = ${newRefund.projectid} \
            AND username = '${newRefund.username}' \
            AND pledgetime = ${newRefund.pledgetime};`
        );
        res.send(newRefund);
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send(e)
    }
})

router.post('/report/comment', async (req, res) => {
    try {
        let commentUpdate = req.body

        await db.none(
            `UPDATE PROJECT_REPORT
            SET handledescription = '${commentUpdate.handledescription}' 
            WHERE projectid = ${commentUpdate.projectid}
            AND username = '${commentUpdate.username}';`
        );
        res.send(commentUpdate);
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send(e)
    }
})

router.post('/report/handle', async (req, res) => {
    try {
        let reportUpdate = req.body
        reportUpdate.handledtime = new Date().getTime();

        await db.none(
            `UPDATE PROJECT_REPORT 
            SET handlername = '${reportUpdate.handlername}', 
            handledtime = ${reportUpdate.handledtime} 
            WHERE projectid = ${reportUpdate.projectid} 
            AND username = '${reportUpdate.username}';`
        );
        res.send(reportUpdate);
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send(e)
    }
})

router.delete('/project/:projectid', async (req, res) => {
    try {
        let projectId = req.params.projectid;

        //Delete report
        await db.none(
            `DELETE FROM PROJECT WHERE id=${projectId}`
        )

        res.send(projectId);
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send(e);
    }
})

router.get('/project/name', async (req, res) => {
    try {

        // Construct Where Query

        // Checking for names
        let whereQuery = "";
        if (req.query.names) {
            nameQueryJSON = JSON.parse(req.query.names);
            whereQuery = nameQueryJSON.length > 0 ? "WHERE " : "";
            nameQueryJSON
                .map(name => name.trim())
                .filter(name => name.length > 0)
                .forEach((name, index) => {
                    whereQuery += `p.projectname LIKE '%${name}%' `;

                    if (index < nameQueryJSON.length - 1) {
                        whereQuery += "OR ";
                    }
                })
        }

        //Check for status type -- HAVING QUERY
        let havingQuery = ""

        if (req.query.status) {
            havingQuery = ""
            let currenttime = new Date().getTime()

            if (req.query.status === "ALL") {
                havingQuery += ""
            } else if (req.query.status === "FUNDED") {
                havingQuery += `HAVING p.targetamount = CASE WHEN SUM(pledges.amount) IS NULL THEN 0 ELSE SUM(pledges.amount) END `
            } else if (req.query.status === "PENDING") {
                havingQuery += `HAVING p.targetamount > CASE WHEN SUM(pledges.amount) IS NULL THEN 0 ELSE SUM(pledges.amount) END AND p.startdate > ${currenttime} `
            } else if (req.query.status === "ONGOING") {
                havingQuery += `HAVING p.targetamount > CASE WHEN SUM(pledges.amount) IS NULL THEN 0 ELSE SUM(pledges.amount) END AND p.startdate < ${currenttime} AND p.enddate > ${currenttime}`
            } else if (req.query.status === "EXPIRED") {
                havingQuery += `HAVING p.targetamount > CASE WHEN SUM(pledges.amount) IS NULL THEN 0 ELSE SUM(pledges.amount) END AND p.enddate < ${currenttime} `
            } else if (req.query.status === "BANNED") {
                havingQuery += `HAVING p.isbanned = true`
            }

        }

        let result = await db.any(
            `SELECT p.id, p.projectname, p.projectdescription, p.targetamount, p.projectowner, p.startdate, p.enddate, p.createtime, p.isbanned, CAST ( (CASE WHEN SUM(pledges.amount) IS NULL THEN 0 ELSE SUM(pledges.amount) END) AS INTEGER )AS currentamt\
            FROM PROJECT p
            LEFT OUTER JOIN PLEDGING_PLEDGES pledges ON pledges.projectid = p.id AND pledges.isrefunded = false
            ${whereQuery}
            GROUP BY p.id, p.projectname, p.projectdescription, p.targetamount, p.projectowner, p.startdate, p.enddate, p.createtime, p.isbanned
            ${havingQuery};`
        );

        res.send(result)
    } catch (e) {
        console.log(e)
        res.send(e)
    }
})

module.exports = router;