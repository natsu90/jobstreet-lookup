
import getJobDetails from 'whatsthesalary';
import express from 'express';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import { URL } from 'url';

const __dirname = new URL('.', import.meta.url).pathname;

const app = express()
const port = 3001

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

// Start server
const server = app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

server.setTimeout(300000)