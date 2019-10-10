const express = require('express')
const app = express()
const path = require('path')
var bodyParser = require('body-parser')

var fs = require('fs')

const pgp = require('pg-promise')({
    // Initialization Options
});

// Preparing the connection details:
const cn = 'postgres://postgres:root@localhost:5432/cs2102_project';
//const cn = 'postgres://postgres:jcdd@localhost:8000/cs2102_project';

// Creating a new database instance from the connection details:
db = null;
app.use(bodyParser());

var user = require('./routes/user-route.js');
app.use('/api/user/', user);

var project = require('./routes/project-route.js');
app.use('/api/project/', project);

var tag = require('./routes/tag-route.js');
app.use('/api/tag/', tag);

var pledge = require('./routes/pledge-route.js');
app.use('/api/pledge/', pledge);

var admin = require('./routes/admin-route.js');
app.use('/api/admin/', admin);

var report = require('./routes/report-route.js');
app.use('/api/report/', report);

var log = require('./routes/comment-route.js');
app.use('/api/comment/', log);

var log = require('./routes/log-route.js');
app.use('/api/log/', log);

//Setup For Image Uploading
const image_upload_dir = "uploads"
if (!fs.existsSync(image_upload_dir)){
    fs.mkdirSync(image_upload_dir);
}

var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, image_upload_dir)
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}.jpg`)
    }
});
var upload = multer({storage: storage});

//Image Uploading
app.post('/imageUpload', upload.single('file0'), (req, res) => {
    res.send({filename: req.file.filename})
});

app.use('/project/img', express.static('uploads'))

// For Angular Project Routing
app.use(express.static('dist'))
app.get('/*', async(req, res) => {
    res.sendFile(path.join(__dirname, "/dist/index.html"))
})

app.listen(3000, '0.0.0.0', () => {
    console.log('Example app listening on port 3000!');
    db = pgp(cn);
})