
import getJobDetails, { browser } from 'whatsthesalary';
import express from 'express';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import { URL } from 'url';

const __dirname = new URL('.', import.meta.url).pathname;

const app = express()
const port = 3002

const apiTimeout = 5 * 60 * 1000;
app.use((req, res, next) => {
    // Set the timeout for all HTTP requests
    req.setTimeout(apiTimeout, () => {
        let err = new Error('Request Timeout');
        err.status = 408;
        next(err);
    });
    // Set the server response timeout for all HTTP requests
    res.setTimeout(apiTimeout, () => {
        let err = new Error('Service Unavailable');
        err.status = 503;
        next(err);
    });
    next();
})

app.use(bodyParser.json());
app.engine('html', ejs.renderFile)

app.get('/', (req, res) => {

    res.render(__dirname + '/index.html')
})

app.post('/', async (req, res) => {

    const link = req.body.link

    try {
        const jobDetails = await getJobDetails(link)
        return res.json(jobDetails)
    } catch (error) {
        return res.status(400).send(error.message)
    }
})

const closeBrowser = async() => {
    await browser.close()
}

// listen for TERM signal .e.g. kill
process.on ('SIGTERM', closeBrowser);

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', closeBrowser); 

//or even exit event 
process.on('exit', closeBrowser);

// Start server
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})