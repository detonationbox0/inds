const myQueue = require('./jobQueue')

myQueue.process(async (job) => {

    console.log(job)


})

console.log("Worker started.")
