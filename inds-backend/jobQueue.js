require('dotenv').config()

const Queue = require('bull');
const myQueue = new Queue('indsQueue');


myQueue.process((job, done) => {

    console.log("Building XML:")
    const scriptPath = job.data.scriptPath;
    const zipFile = process.env.SERVER_PATH + job.data.files[1].filename
    const csvFile = process.env.SERVER_PATH + job.data.files[0].filename
    console.log(scriptPath, zipFile, csvFile)
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
                    <IDSP:scriptArgs>
                        <IDSP:name>csvFile</IDSP:name>
                        <IDSP:value>${csvFile}</IDSP:value>
                    </IDSP:scriptArgs>
                </IDSP:runScriptParameters>
            </IDSP:RunScript>
        </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>
    `
    console.log(xml);

    let options = {
        method: 'POST',
        body: xml,
        headers: {
            'Content-Type': 'text/xml;charset=utf-8',
            'Accept-Encoding': 'gzip,deflate',
            'Content-Length': xml.length,
            'Connection': 'keep-alive'
            // 'SOAPAction':"http://Main.Service/AUserService/GetUsers"
        }
    }
    fetch('http://localhost:18383/service?wsdl', options)
        .then(() => {
            job.progress = 100;
            done();
        })

})


module.exports = myQueue

