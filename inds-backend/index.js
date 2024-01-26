require('dotenv').config()

const express = require('express')
const path = require('path')
const PORT = 5000
const app = express()

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const multer = require('multer')

const myQueue = require('./jobQueue')
// myQueue.on('completed', (job, result) => {
//     console.log("Job done:", job)
// })
// myQueue.empty(1000000)


// Save files to disk
const storage = multer.diskStorage({
    destination: function(_req, _file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(_req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage
})

// const bodyParser = require('body-parser')

app.get('/', (_req, res) => {
    res.json({
        message: "Hello from server."
    })
})

app.post('/api/upload', upload.array('file', 5), async (req, res) => {

    const pdfPath = req.files[1].filename.split(".")[0]

    const job = {
        jobId: req.body.uid,
        jobName: req.body.name,
        files: req.files,
        pdfPath: `${pdfPath}.pdf`
    }
    console.log("Sending to queue:", job);

    await myQueue.add(job)

    res.json({
        message: "Job added to queue.",
        job: job
    })

});

app.get('/api/jobStatus', (_req, res) => {
    myQueue.getJobs(['completed']).then(jobs => {
        res.json(jobs)
    })
})

app.get('/api/allJobs', async (_req, res) => {
    // let jobs = {
    //     completed: [],
    //     all: []
    // }
    // let completedJobs = await myQueue.getJobs(['completed']);
    let allJobs = await myQueue.getJobs();
    res.json(allJobs)
})

app.post('/api/downloadFile', jsonParser, (req, res) => {
    console.log(req.body)
    let downloadPath = `${process.env.SERVER_PATH}${req.body.file}`
    console.log(downloadPath)
    res.download(downloadPath)
});




app.listen(PORT, () => {
    console.log("SERVER_PATH", process.env.SERVER_PATH)
    console.log("SCRIPT_PATH", process.env.SCRIPT_PATH)
    console.log(`Server listening on port ${PORT}`)
});