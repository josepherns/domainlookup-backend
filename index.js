require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');  
const app = express();
app.use(cors());
const port = 3000;

// Load the API key from environment variables
const WHOIS_API_URL = 'https://www.whoisxmlapi.com/whoisserver/WhoisService';
const WHOIS_API_KEY = process.env.WHOIS_API_KEY;  // Use environment variable

const msToTime = (duration) => {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

app.use(express.json());
app.use(bodyParser.json());

app.post('/whois', async (req, res) => {
    const { domain, type } = req.body;

    if (!domain || !type) {
        return res.status(400).json({ error: 'Domain and type are required.' });
    }

    try {
        let url = `${WHOIS_API_URL}?apiKey=${WHOIS_API_KEY}&domainName=${domain}&outputFormat=JSON`;

        // Modify URL based on requested type
        if (type === 'contact') {
            url += '&type=contact';
        } else if (type !== 'domain') {
            return res.status(400).json({ error: 'Invalid type. Valid types are "domain" or "contact".' });
        }

        console.log(`Request URL: ${url}`);  // Log the URL for debugging

        const response = await axios.get(url);
        let result = response.data;

        const whoisRecord = result.WhoisRecord;
        const newResponse = {
            contact: null,
            domain: null
        };

        const domainName = whoisRecord.domainName || domain;
        const registrantName = whoisRecord.registrant?.name || 'N/A';
        const createdDate = whoisRecord.createdDate || 'N/A';
        const expiresDate = whoisRecord.expiresDate || 'N/A';
        const updatedDate = whoisRecord.updatedDate || 'N/A';
        const ageOfDomain = msToTime(new Date(expiresDate) - new Date(updatedDate));

        const nameServers = whoisRecord.nameServers?.hostNames?.map(ns => ({
            host: ns,
            address: ns.substring(0, 25)
        })) || [];

        newResponse.domain = {
            domainName,
            registrantName,
            createdDate,
            expiresDate,
            ageOfDomain,
            nameServers
        };

        const registrantContactName = whoisRecord.registrant?.name || 'N/A';
        const technicalContactName = whoisRecord.technicalContact?.name || 'N/A';
        const administrativeContactName = whoisRecord.administrativeContact?.name || 'N/A';
        const contactEmail = whoisRecord.registrant?.email || 'N/A';

        newResponse.contact = {
            registrantContactName,
            technicalContactName,
            administrativeContactName,
            contactEmail
        };

        return res.json(newResponse);

    } catch (error) {
        console.error('Error fetching data from Whois API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'An error occurred while fetching data from the Whois API.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
