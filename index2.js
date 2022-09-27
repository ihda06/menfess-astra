// require('dotenv').config();
// const botMenfess = require('./index')
import menfessBot, { getDM } from "./index.js";
import Express from "express";
import Cron from "node-cron";

// const express = require('express');
const bot = menfessBot;

const app = Express();
const port = 3030;

const task = Cron.schedule(
  "*/2 * * * *",
  async () => {
    console.log("session started");
    await bot();
    console.log("session ended");
  },
  { scheduled: false }
);

// const { Twitterbot } = require('./twitter-bot');
// const twitterBot = new Twitterbot({
//     appKey: process.env.APP_KEY,
//     appSecret: process.env.APP_SECRET,
//     accessToken: process.env.ACCESS_TOKEN,
//     accessSecret: process.env.ACCESS_SECRET,
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
// })

app.get("/", (req, res) => {
  res.send("welcome to pembelajaran bot twitter");
});

app.get("/getadmin", async (req, res, next) => {
  const data = await twitterBot.getAdminuserInfo();
  console.log(data);
  res.setHeader("content-type", "application/json");
  res.json({ data });
});

app.get("/dm", async (req, res, next) => {
  const data = await getDM();
  res.json({ data });
});
app.get("/on", async (req, res, next) => {
  task.start();
  res.send("Job started");
  console.log("job started");
});

app.get("/stop", async (req, res, next) => {
  task.stop();
  res.send("job stopped");
  console.log("job stopped");
});

app.get("/tweet", async () => {
  const tweetResult = await twitterBot.twe;
});

app.listen(port, () => {
  console.log(`server is litening to port ${port}`);
});
