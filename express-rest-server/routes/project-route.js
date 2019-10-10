var express = require('express');
var router = express.Router();

router.get('/', async (req, res) => {
    try {
        let result = await db.any(`SELECT * FROM PROJECT;`)
        res.send(result)
    } catch (e) {
        console.log(e)
        res.send(e)
    }
})

router.get('/name', async (req, res) => {
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

        // Check for project owner
        if (req.query.username) {
            whereQuery = whereQuery.length > 0 ? "AND " : "WHERE "
            whereQuery += `p.projectowner='${req.query.username}' `
        }

        //Check for status type -- HAVING QUERY
        let havingQuery = ""

        if (req.query.status) {
            havingQuery = "HAVING "
            let currenttime = new Date().getTime()

            if (req.query.status === "ALL") {
                havingQuery += "p.isbanned <> true"
            } else if (req.query.status === "FUNDED") {
                havingQuery += `p.isbanned <> true AND p.targetamount = CASE WHEN SUM(pledges.amount) IS NULL THEN 0 ELSE SUM(pledges.amount) END `
            } else if (req.query.status === "PENDING") {
                havingQuery += `p.isbanned <> true AND p.targetamount > CASE WHEN SUM(pledges.amount) IS NULL THEN 0 ELSE SUM(pledges.amount) END AND p.startdate > ${currenttime} `
            } else if (req.query.status === "ONGOING") {
                havingQuery += `p.isbanned <> true AND p.targetamount > CASE WHEN SUM(pledges.amount) IS NULL THEN 0 ELSE SUM(pledges.amount) END AND p.startdate < ${currenttime} AND p.enddate > ${currenttime}`
            } else if (req.query.status === "EXPIRED") {
                havingQuery += `p.isbanned <> true AND p.targetamount > CASE WHEN SUM(pledges.amount) IS NULL THEN 0 ELSE SUM(pledges.amount) END AND p.enddate < ${currenttime} `
            }
        }

        let displayOrderQuery = "";
        if (req.query.displayOptions) {
            displayOptions = JSON.parse(req.query.displayOptions);
            let hasOrderAlready = false;

            //Checking for Result Ordering
            for (var property in displayOptions) {
                if (displayOptions.hasOwnProperty(property)) {
                    //In case later options has pageSizeLimit
                    if (displayOptions[property] === true || displayOptions[property] === false) {
                        hasOrderAlready = true;
                        displayOrderQuery += `ORDER BY ${property} ${displayOptions[property] ? 'ASC' : 'DESC'}`;
                    }
                }
            }

            //Default Order Settings
            if (!hasOrderAlready) {
                displayOrderQuery += `ORDER BY createtime DESC`
            }
        }

        let result = await db.any(
            `SELECT p.id, p.projectname, p.projectdescription, p.targetamount, p.projectowner, p.startdate, p.enddate, p.createtime, p.isbanned, CAST ( (CASE WHEN SUM(pledges.amount) IS NULL THEN 0 ELSE SUM(pledges.amount) END) AS INTEGER )AS currentamt\
            FROM PROJECT p
            LEFT OUTER JOIN PLEDGING_PLEDGES pledges ON pledges.projectid = p.id AND pledges.isrefunded = false
            ${whereQuery}
            GROUP BY p.id, p.projectname, p.projectdescription, p.targetamount, p.projectowner, p.startdate, p.enddate, p.createtime, p.isbanned
            ${havingQuery}
            ${displayOrderQuery};`
        );

        res.send(result)
    } catch (e) {
        console.log(e)
        res.send(e)
    }
})

router.get('/tag', async (req, res) => {

    try {

        let whereQuery = "";
        if (req.query.tags) {
            nameQueryJSON = JSON.parse(req.query.tags);
            whereQuery = nameQueryJSON.length > 0 ? "WHERE " : "";
            nameQueryJSON
                .map(name => name.trim())
                .filter(name => name.length > 0)
                .forEach((name, index) => {
                    whereQuery += `t.tagName = '${name}' `;
                    if (index < nameQueryJSON.length - 1) {
                        whereQuery += "OR ";
                    }
                })
        }

        if (req.query.username) {
            whereQuery = whereQuery.length > 0 ? "WHERE " : "AND "
            whereQuery += `AND p.projectowner='${req.query.username}' `
        }

        //Check for status type -- HAVING QUERY
        let havingQuery = ""

        if (req.query.status) {
            havingQuery = "HAVING "
            let currenttime = new Date().getTime()

            if (req.query.status === "ALL") {
                havingQuery += "p.isbanned <> true"
            } else if (req.query.status === "FUNDED") {
                havingQuery += `p.isbanned <> true AND p.targetamount = CASE WHEN SUM(pledges.amount) IS NULL THEN 0 ELSE SUM(pledges.amount) END `
            } else if (req.query.status === "PENDING") {
                havingQuery += `p.isbanned <> true AND p.targetamount > CASE WHEN SUM(pledges.amount) IS NULL THEN 0 ELSE SUM(pledges.amount) END AND p.startdate > ${currenttime} `
            } else if (req.query.status === "ONGOING") {
                havingQuery += `p.isbanned <> true AND p.targetamount > CASE WHEN SUM(pledges.amount) IS NULL THEN 0 ELSE SUM(pledges.amount) END AND p.startdate < ${currenttime} AND p.enddate > ${currenttime}`
            } else if (req.query.status === "EXPIRED") {
                havingQuery += `p.isbanned <> true AND p.targetamount > CASE WHEN SUM(pledges.amount) IS NULL THEN 0 ELSE SUM(pledges.amount) END AND p.enddate < ${currenttime} `
            }
        }

        let displayOrderQuery = "";
        if (req.query.displayOptions) {
            displayOptions = JSON.parse(req.query.displayOptions);
            let hasOrderAlready = false;
            for (var property in displayOptions) {
                if (displayOptions.hasOwnProperty(property)) {
                    //In case later options has pageSizeLimit
                    if (displayOptions[property] === true || displayOptions[property] === false) {
                        hasOrderAlready = true;
                        displayOrderQuery += `ORDER BY ${property} ${displayOptions[property] ? 'ASC' : 'DESC'}`;
                    }
                }
            }

            //Default Order Settings
            if (!hasOrderAlready) {
                displayOrderQuery += `ORDER BY createtime DESC`
            }
        }

        let result = await db.any(
            `SELECT p.id, p.projectname, p.projectdescription, p.targetamount, p.projectowner, p.startdate, p.enddate, p.createtime, p.isbanned, CAST( (CASE WHEN SUM(pledges.amount) IS NULL THEN 0 ELSE SUM(pledges.amount) END) AS INTEGER) AS currentamt\
            FROM PROJECT p
            INNER JOIN TAGGED_TO_TAG t ON t.projectid = p.id
            LEFT OUTER JOIN PLEDGING_PLEDGES pledges ON pledges.projectid = p.id AND pledges.isrefunded = false
            ${whereQuery}
            GROUP BY p.id, p.projectname, p.projectdescription, p.targetamount, p.projectowner, p.startdate, p.enddate, p.createtime, p.isbanned
            ${havingQuery}
            ${displayOrderQuery};`
        );
        res.send(result)
    } catch (e) {
        console.log(e)
        res.send(e)
    }
})

router.get('/id/:projectId', async (req, res) => {
    try {

        let result = await db.one(
            `SELECT p.id, p.projectname, p.projectdescription, p.targetamount, p.projectowner, p.startdate, p.enddate, p.imagefilename, p.createtime, p.isbanned, CASE WHEN SUM(pledges.amount) IS NULL THEN 0 ELSE SUM(pledges.amount) END AS currentamt \
             FROM PROJECT p \
             LEFT OUTER JOIN PLEDGING_PLEDGES pledges ON pledges.projectid = p.id AND pledges.isrefunded = false \
             WHERE p.id=${req.params.projectId} \
             GROUP BY p.id, p.projectname, p.projectdescription, p.targetamount, p.projectowner, p.startdate, p.enddate, p.createtime, p.isbanned;`
        )

        res.send(result);
    } catch (e) {
        console.log(e)
        res.send(e)
    }
})

router.get('/progress', async (req, res) => {
    try {

        let currentTime = new Date().getTime()
        let result = await db.any(
            `SELECT *, CAST(currentamt AS float)/targetamount AS progress 
            FROM (SELECT p.id, p.projectname, p.projectdescription, p.targetamount, p.projectowner, p.startdate, p.enddate, p.imagefilename, p.createtime, p.isbanned, CASE WHEN SUM(pledges.amount) IS NULL THEN 0 ELSE SUM(pledges.amount) END AS currentamt
                    FROM PROJECT p
                    LEFT OUTER JOIN PLEDGING_PLEDGES pledges ON pledges.projectid = p.id AND pledges.isrefunded = false
                    WHERE p.isbanned <> true AND p.startdate <= ${currentTime} AND p.enddate > ${currentTime} 
                    GROUP BY p.id, p.projectname, p.projectdescription, p.targetamount, p.projectowner, p.startdate, p.enddate, p.createtime, p.isbanned
                    HAVING p.targetamount > SUM(pledges.amount)
                    ) projects ORDER BY progress DESC
            LIMIT 10;`
        )

        res.send(result);
    } catch (e) {
        console.log(e)
        res.send(e)
    }
})

// Select Funded Projects
router.get('/leaderboard', async (req, res) => {
    try {
        let result = await db.any(
            `SELECT project.id, project.projectname, SUM(pledge.amount) AS amtraised, project.targetamount
            FROM PROJECT project
            INNER JOIN PLEDGING_PLEDGES pledge ON pledge.isrefunded=false AND project.id=pledge.projectid
            GROUP BY project.id, project.projectname, project.targetamount
            HAVING SUM(pledge.amount) = project.targetamount
            ORDER BY SUM(pledge.amount) DESC
            LIMIT 10;`
        );
        res.send(result);
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send(e)
    }
})

router.post('/', async (req, res) => {
    try {
        let newProject = req.body;
        newProject.createtime = new Date().getTime();

        //Create Project
        let result = await db.one(
            `INSERT INTO PROJECT \
            (\
              projectName,\
              projectDescription,\
              targetAmount,\
              projectOwner,\
              startDate,\
              endDate,\
              createTime,
              imageFileName
            ) \
            VALUES(\
                '${newProject.projectname}', \
                '${newProject.projectdescription}', \
                ${newProject.targetamount},\
                '${newProject.projectowner}',\
                ${newProject.startdate},\
                ${newProject.enddate},\
                ${newProject.createtime},\
                ${newProject.projectimagename ? `'${newProject.projectimagename}'` : 'NULL'}
                ) \
                RETURNING id;`
        );


        let id = result.id;

        //Insert Tag
        for (let i = 0; i < newProject.tags.length; i++) {
            let currentTag = newProject.tags[i];
            await db.none(
                `INSERT INTO TAGGED_TO_TAG (tagName, projectId) VALUES ('${currentTag}', ${id});`
            )
        }

        res.send(result);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

router.put('/:projectId', async (req, res) => {
    try {
        //Testing
        let updatedProject = req.body

        //Remove any existing tags
        let tagResult = await db.any(
            `DELETE FROM TAGGED_TO_TAG WHERE projectid=${req.params.projectId};`
        )

        let result = await db.any(
            `UPDATE PROJECT
            SET projectName='${updatedProject.projectname}',
            projectDescription='${updatedProject.projectdescription}',
            targetAmount=${updatedProject.targetamount},
            startDate=${updatedProject.startdate},
            endDate=${updatedProject.enddate}
            WHERE id='${req.params.projectId}';`
        );

        //Update New Tags
        for (let i = 0; i < updatedProject.tags.length; i++) {
            let currentTag = updatedProject.tags[i];
            await db.any(
                `INSERT INTO TAGGED_TO_TAG
                (projectId, tagName)
                VALUES(${req.params.projectId}, '${currentTag}');`
            )
        }

        res.send(result)
    } catch (e) {
        console.log(e)
        res.send(e)
    }
})

router.delete('/:projectId', async (req, res) => {
    try {
        let result = await db.any(
            `DELETE FROM PROJECT WHERE id=${req.params.projectId};`
        )
        res.send(result)
    } catch (e) {
        console.log(e)
        res.send(e)
    }
})

module.exports = router;