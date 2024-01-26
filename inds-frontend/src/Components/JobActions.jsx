import { FiletypeCsv } from 'react-bootstrap-icons'
import { Easel } from 'react-bootstrap-icons'
import { FilePdf } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/Button'

const JobActions = ({ csvPath, inddPath, pdfPath }) => {

    const downloadFile = (e) => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ file: e.target.value })
        }
        console.log(options)
        fetch('/api/downloadFile', options)
            .then((res) => res.blob())
            .then((blob) => {
                // Create blob link to download
                const url = window.URL.createObjectURL(
                    new Blob([blob]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    `${e.target.value}`,
                );

                // Append to html link element page
                document.body.appendChild(link);

                // Start download
                link.click();

                // Clean up and remove the link
                link.parentNode.removeChild(link);
            })
    }

    return (
        <>
            <Button className="mx-2" size="sm" value={csvPath}
                onClick={downloadFile}>
                <FiletypeCsv /> Download CSV
            </Button>
            <Button className="mx-2" size="sm" value={inddPath}
                onClick={downloadFile}>
                <Easel /> Download Artwork
            </Button>
            <Button className="mx-2" size="sm" value={pdfPath}
                onClick={downloadFile}>
                <FilePdf /> Download Print
            </Button>
        </>
    )
}

export default JobActions
