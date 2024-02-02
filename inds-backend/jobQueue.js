require('dotenv').config()

const Queue = require('bull');
const myQueue = new Queue('indsQueue');
const { XMLParser } = require('fast-xml-parser')
const axios = require('axios');

myQueue.process((job, done) => {

    console.log("Building XML:")
    const zipFile = process.env.SERVER_PATH + job.data.zipFile.filename
    // const csvFile = process.env.SERVER_PATH + job.data.files[0].filename
    console.log(job.data.zipFile)
    let xml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:IDSP="http://ns.adobe.com/InDesign/soap/">
        <SOAP-ENV:Body>
            <IDSP:RunScript>
                <IDSP:runScriptParameters>
                    <IDSP:scriptText></IDSP:scriptText>
                    <IDSP:scriptLanguage>javascript</IDSP:scriptLanguage>
                    <IDSP:scriptFile>${process.env.SCRIPT_PATH}</IDSP:scriptFile>
                    <IDSP:scriptArgs>
                        <IDSP:name>zipFile</IDSP:name>
                        <IDSP:value>${zipFile}</IDSP:value>
                    </IDSP:scriptArgs>
                </IDSP:runScriptParameters>
            </IDSP:RunScript>
        </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>
    `
    console.log(xml);

    // Fetch has a short and unconfigurable timeout.
    // There doesn't appear to be any way to increase that timeout, 
    // as it is defined by the browser:
    // https://github.com/nodejs/node/issues/46375
    //
    // Since these merges can take > 5 mintes, we'll use 
    // axios instead.
    //
    axios.post("http://localhost:18383/service?wsdl", xml, {
        timout: 3600000 // 1 hour timeout
        // timeout: 28800000 // 8 hour timeout
    })
        .then(response => {
            // Response is XML SOAP that includes the names of the PDF output files
            const parser = new XMLParser();
            let pXml = parser.parse(response.data)
            console.dir(pXml, { depth: null, colors: true })
            let pdfFiles = pXml['SOAP-ENV:Envelope']['SOAP-ENV:Body']['IDSP:RunScriptResponse']
                .scriptResult
                .data
                .item
            if (Array.isArray(pdfFiles)) {
                pdfFiles = pdfFiles.map(obj => obj.data)
            } else {
                pdfFiles = [pdfFiles.data]
            }
            console.log(pdfFiles)
            job.update({ ...job.data, pdfFiles: pdfFiles })
            job.progress = 100;
            done();
        })

    // OLD WAY:
    //
    // let options = {
    //     hostname: 'http://localhost/',
    //     port: 18383,
    //     path: 'service?wsdl',
    //     method: 'POST',
    //     body: xml,
    //     headers: {
    //         'Content-Type': 'text/xml;charset=utf-8',
    //         'Accept-Encoding': 'gzip,deflate',
    //         'Content-Length': xml.length,
    //         'Connection': 'keep-alive'
    //     }
    // }
    // fetch('http://localhost:18383/service?wsdl', options)
    //     .then((res) => res.text())
    //     .then((res) => {
    //         // Response is XML SOAP that includes the names of the PDF output files
    //         const parser = new XMLParser();
    //         let pXml = parser.parse(res)
    //         console.dir(pXml, { depth: null, colors: true })
    //         let pdfFiles = pXml['SOAP-ENV:Envelope']['SOAP-ENV:Body']['IDSP:RunScriptResponse']
    //             .scriptResult
    //             .data
    //             .item
    //         if (Array.isArray(pdfFiles)) {
    //             pdfFiles = pdfFiles.map(obj => obj.data)
    //         } else {
    //             pdfFiles = [pdfFiles.data]
    //         }
    //         console.log(pdfFiles)
    //         job.update({ ...job.data, pdfFiles: pdfFiles })
    //         job.progress = 100;
    //         done();
    //     })

})


module.exports = myQueue

