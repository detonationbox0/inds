import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import './UploadDialog.css'

const UploadDialog = ({ showing, handleClose }) => {

    // Get rid of handleClose when app is complete.
    // The handleSubmit process will hide the dialog instead

    return (
        <>
            <Modal show={showing} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Uploading your files...</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Uploading...</p>
                </Modal.Body>
            </Modal >
        </>
    )
}

export default UploadDialog


