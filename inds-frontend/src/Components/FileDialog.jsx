// import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

import './FileDialog.css'

const FileDialog = ({ showing, handleClose, handleSubmit, jobState, csv, inds }) => {

    const [jobName, setJobName] = [...jobState];
    const [csvFile, setCsvFile] = [...csv];
    const [indsFile, setIndsFile] = [...inds];


    // User chooses the CSV and INDD File
    // update state
    const handleFile = (e) => {
        console.log(e.target.files[0])
        if (e.target.files[0].type === "text/csv") {
            setCsvFile(e.target.files[0])
        } else {
            console.log("Setting the indd file...")
            setIndsFile(e.target.files[0])
        }
    }

    return (
        <>
            <Modal show={showing} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a Job</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Job Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={jobName}
                                onChange={(e) => setJobName(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formFileSm" className="mb-3">
                            <Form.Label>Choose a CSV...</Form.Label>
                            <Form.Control
                                type="file"
                                size="sm"
                                accept=".csv"
                                onChange={handleFile}
                            />
                        </Form.Group>
                        <Form.Group controlId="formFileSm" className="mb-3">
                            <Form.Label>Choose an InDesign package...</Form.Label>
                            <Form.Control
                                type="file"
                                size="sm"
                                accept=".zip"
                                onChange={handleFile}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={handleSubmit}>Submit</Button>
                </Modal.Footer>
            </Modal >
        </>
    )
}

export default FileDialog
