import { useState, useEffect } from 'react'

// My Components
import FileDialog from './Components/FileDialog'
import UploadDialog from './Components/UploadDialog'
import JobTable from './Components/JobTable'

// React Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import './App.css'

function App() {

    //  State to hold the jobs
    const [jobs, setJobs] = useState([])
    const [jobName, setJobName] = useState("New Job")

    //  State for handling the files chosen
    const [csvFile, setCsvFile] = useState(undefined)
    const [indsFile, setIndsFile] = useState(undefined)

    //  State for FileDialog visibility
    const [show, setShow] = useState(false)

    //  State for Uploading Message visibilitiy
    const [uploadShow, setUploadShow] = useState(false)

    //  On load, load in jobs from Redis
    useEffect(() => {
        // {{{ Load in the jobs from Redis
        fetch('/api/allJobs')
            .then((res) => res.json())
            .then((data) => {
                console.log("ALL JOBS:", data)
                // Add job to the UI job queue
                let newJobs = [];
                data.forEach((job) => {
                    newJobs.push(
                        {
                            id: job.data.jobId,
                            name: job.data.jobName,
                            files: [job.data.zipFile.filename].concat(job.data.pdfFiles),
                            status: job.finishedOn ? 'Complete' : 'Pending',
                            showIcons: job.finishedOn ? true : false,
                        }
                    )
                })
                setJobs(jobs.concat(newJobs));
            })
        // }}}
    }, [])

    //  Check the jobs every 5 seconds for status updates 
    useEffect(() => {
        // {{{ Runs every 5 seconds to check status of jobs
        const interval = setInterval(() => {

            // Grab the jobs, and log them.
            fetch('/api/jobStatus')
                .then((res) => res.json())
                .then((data) => {

                    // console.log("Checking the jobs...")

                    data.forEach((job) => {
                        setJobs(jobs.map((mjob) => {
                            if (mjob.id === job.data.jobId) {
                                // This job is completed.
                                mjob.files = [job.data.zipFile.filename].concat(job.data.pdfFiles)
                                mjob.status = 'Complete'
                                mjob.showIcons = true;
                            }
                            return mjob
                        }))
                    })



                })
                .catch((err) => {
                    console.log(err)
                })


        }, 5000)

        return () => clearInterval(interval)
        //}}}
    }, [jobs])


    //  Show / Hide the FileDialog
    const handleShow = () => setShow(true);
    const handleClose = () => {
        // Clear the state
        setCsvFile(undefined);
        setIndsFile(undefined);
        setShow(false);
    }

    //  Hide the Uploading... message
    const handleUploadClose = () => setUploadShow(false)

    //  Upload the files selected
    const uploadFiles = (zipFile) => {
        // {{{ Sends the files to the API
        return new Promise((resolve, reject) => {

            // Object to pass with request
            const newFileData = new FormData();

            newFileData.append('zipFile', zipFile)

            // Make UID for the job
            const uid = Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36)
            newFileData.append('uid', uid)
            newFileData.append('name', jobName)


            console.log(newFileData);
            fetch('/api/upload', {
                method: "POST",
                body: newFileData
            })
                .then(res => res.json())
                .then(data => {

                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
        })
        // }}}
    }

    //  User submits the new job
    const handleSubmit = () => {
        // {{{ User submits the job
        if (indsFile === undefined) {
            // Tell the user to upload something
            alert("Upload files first...")
            return;
        }

        // Hide the dialog
        setShow(false);

        // Show the Uploading dialog
        setUploadShow(true);

        console.log("Files to upload:", csvFile, indsFile)

        // Send the files to the api...
        uploadFiles(indsFile)
            .then((res) => {

                console.log("DONE UPLOADING! job:")
                console.log(res)

                setUploadShow(false);


                setJobs([
                    {
                        id: res.job.jobId,
                        name: res.job.jobName,
                        files: [],
                        status: 'Pending',
                        showIcons: false,
                    },
                    ...jobs
                ]);


            })

        // Clear the state
        setCsvFile(undefined);
        setIndsFile(undefined);
        console.log("Cleared the state.")
        // }}}
    }

    // ✍️ User Interface
    return (
        <>
            {/* {{{ User Interface */}
            <Container>
                <FileDialog
                    showing={show}
                    handleClose={handleClose}
                    handleSubmit={handleSubmit}
                    jobState={[jobName, setJobName]}
                    csv={[csvFile, setCsvFile]}
                    inds={[indsFile, setIndsFile]}
                />
                <UploadDialog
                    showing={uploadShow}
                    handleClose={handleUploadClose}
                />
                <Row>
                    {/* Header */}
                    <Col>
                        <h1>InDesign Server Job Queue</h1>
                    </Col>
                </Row>
                <Row>
                    {/* Body */}
                    <Col>
                        <JobTable jobs={jobs} />
                        <Button variant="primary" onClick={handleShow}>Add Job</Button>
                    </Col>
                </Row>
            </Container>
            {/* }}} */}
        </>
    )
}

export default App
