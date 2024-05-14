//test
var zipPath = app.scriptArgs.getValue("zipFile");
var zipFile = new File(zipPath)

var parentFolder = new Folder(zipFile.parent)

// Create a folder to unzip the zipFile to
var unzipFolderPath = zipPath.replace(".zip", "")
var unzipFolder = new Folder(unzipFolderPath)

var uid = unzipFolder.displayName.split("_")[0]

// Unzip the zip file
app.unpackageUCF(zipFile, unzipFolderPath)

// Loop the files in unzipFolderPath
var files = unzipFolder.getFiles()

// Collect the CSV files...
var outputFiles = []

for (var i = 0; i < files.length; i++) {

    var csvExt = files[i].name.split(".")[1]
    // For every CSV we find...
    if (csvExt === "csv") {

        app.consoleout("Processing " + files[i].name)

        for (var j = 0; j < files.length; j++) {
            var inddExt = files[j].name.split(".")[1]
            if (inddExt === "idml") {
                // Open the file
                var doc = app.open(files[j])
                // Link to the CSV file
                doc.dataMergeProperties.selectDataSource(files[i])
                // Output file name
                var outputName = uid + "_" + files[i].displayName.split(".")[0] + ".pdf";
                var outputPath = parentFolder.fullName + "/" + outputName
                // Export the file
                var myExport = File(outputPath)
                outputFiles.push(outputName)

                // Sleep for 10 seconds (for demonstration)
                // $.sleep(10000)

                app.consoleout("Exporing " + outputName)
                doc.dataMergeProperties.exportFile(myExport, "[High Quality Print]")
            }
        }
    }
}

app.consoleout("Flushing open documents.")
for (var i = 0; i < app.documents.length; i++) {
    app.documents[i].close(SaveOptions.NO)
}

app.consoleout("All done.")
outputFiles;
