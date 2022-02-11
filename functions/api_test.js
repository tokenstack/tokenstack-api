require('dotenv').config();
const axios = require('axios').default;
const { TOKENSTACK_APP_URL } = require('./tokenstack_config.js');

const apiHostedUrl = "https://us-central1-tokenstack-dev.cloudfunctions.net/api/";
const appHostedUrl = "https://us-central1-tokenstack-dev.cloudfunctions.net/app/";
const apiLocalUrl = "http://localhost:5000/";
const appLocalUrl = "http://localhost:3000/";
const fs = require("fs");
const sampleApiKey = "187d9041-7380-443f-9384-37deb2c34914";

async function testAuthorization() {

    const accessToken = await axios({
        method: 'post',
        url: appHostedUrl + "authenticate",
        data: {
            apiKey: sampleApiKey,
        }
    }).then((response) => response.data);

    console.log(accessToken);
}

async function testCreateNFT() {
    const accessToken = await axios({
        method: 'post',
        url: appHostedUrl + "authenticate",
        data: {
            apiKey: sampleApiKey,
        }
    }).then((response) => response.data);

    const fileData = fs.readFileSync('./images/image.jpg', { encoding: 'base64' });
    const nftData = {
        accessToken: accessToken.access_token,
        description: "an nft made with tokenstack",
        attributes: [{
            "trait_type": "Animal",
            "value": "Cat"
        }],
        externalUrl: "",
        name: "tokenstack nft",
        fileData: fileData,
        privateKey: (await getAppVariable("TEST_PRIVATE_KEY")).result,
        publicKey: (await getAppVariable("TEST_PUBLIC_KEY")).result
    }

    const nft = await axios({
        method: 'post',
        url: apiLocalUrl + "v1/nft/mint",
        data: nftData
    }).then((response) => response.data);

    console.log(nft);
}

async function getAppVariable(variableName) {
    const variable = await axios({
        method: 'post',
        url: appLocalUrl + 'internal/getVariable/',
        data: {
            variable: variableName,
            apiToken: process.env.API_TOKEN,
        }
    }).then((response) => response.data);

    return variable;
}

async function runAllTests() {
    // await testAuthorization();
    await testCreateNFT();
}

runAllTests();
