// const {TwitterApi} = require("twitter-api-v2");
import {TwitterApi} from "twitter-api-v2"
import dotenv from 'dotenv'
dotenv.config()
// require('dotenv').config();

const client = new TwitterApi({
    appKey: process.env.APP_KEY,
    appSecret: process.env.APP_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_SECRET,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    // appKey: "JguNFa3kxf3H5UJdx2r5q9kqz",
    // appSecret: "1V8uwxGiBiB0lcPWVamZd8UuKxeMTNMUJgCaWeHDHQn40vD4Cu",
    // accessToken:"1491240763396882434-vjeR2wnHtqAVWcD8FyUgTtgSxg4uYK",
    // accessSecret:"7662XC0iO6MLSvHu5MdYqT217HerhG6iVdV5fVHuODNzC",
    // clientId:"M2RrYVI3MXFheDFkb1haRkpseFg6MTpjaQ",
    // clientSecret:"QWRc711mpVFU1Kem_Pp2_0-Kbzb4OerfDqakJA47kWoszjH1CI"
})

const rwClient = client.readWrite;

export default rwClient;