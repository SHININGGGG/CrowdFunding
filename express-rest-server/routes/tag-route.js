var express = require('express');
var router = express.Router();

router.get('/', async(req, res) => {
    try {
        let result = await db.any('SELECT * FROM TAGGED_TO_TAG;')
        res.send(result)
    } catch (e) {
        console.log(e)
        res.send(e)
    }
})

router.get('/project/:projectId', async(req, res) => {
    try {
        let result = await db.any(
            `SELECT tagName FROM TAGGED_TO_TAG WHERE projectid = '${req.params.projectId}';`
        )
        res.send(result)
    } catch (e) {
        console.log(e)
        res.send(e)
    }
})

router.get('/suggestion/:tagName', async(req, res) => {
    try {
        let result = await db.any(
            `SELECT DISTINCT tagName FROM TAGGED_TO_TAG WHERE tagName LIKE '${req.params.tagName}%';`
        )

        //Keep only the tagName
        result = result.map(tag => tag.tagname)
        // console.log(result)
        res.send(result)
    } catch (e) {
        console.log(e)
        res.send(e)
    }
})

// router.post('/', async(req, res) => {
//     try {
//         let newTag = req.body
//         console.log(newTag)
//         await db.none(
//             `INSERT INTO TAGGED_TO_TAG VALUES('${newTag.tagname}', ${newTag.projectid});`
//         );
//         res.send(newTag)
//     } catch (e) {
//         console.log(e)
//         res.send(e)
//     }
// })

// router.delete('/:tagName', async(req, res) => {
//     try {
//         let result = await db.any(
//             `DELETE FROM TAGGED_TO_TAG WHERE tagName='${req.params.tagName}';`
//         )
//         res.send(result)
//     } catch (e) {
//         console.log(e)
//         res.send(e)
//     }
// })

module.exports = router;