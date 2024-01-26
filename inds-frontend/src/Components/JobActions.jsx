import { FiletypeCsv } from 'react-bootstrap-icons'
import { Easel } from 'react-bootstrap-icons'
import { FilePdf } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/Button'

const JobActions = ({ files }) => {

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

    // Count the number of CSVs for Download button names
    let csvCount = 1;

    return (
        <>
            {files.map((file) => {
                let fileExt = file.split(".").pop();
                if (fileExt === "zip") {
                    return (
                        <Button key={file} className="m-2" size="sm" value={file}
                            onClick={downloadFile}>
                            <Easel /> Download Artwork
                        </Button>
                    )
                } else {
                    csvCount++;
                    return (
                        <Button key={file} className="m-2" size="sm" value={file}
                            onClick={downloadFile}>
                            <FilePdf /> Download Print {csvCount - 1}
                        </Button>
                    )
                }
            })}
        </>
    )
}

export default JobActions
/*
                    <Button className="mx-2" size="sm" value={csvPath}
                        onClick={downloadFile}>
                        <FiletypeCsv /> Download CSV
                    </Button>
*/
