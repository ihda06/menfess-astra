import menfessBot, { getDM } from "./index.js";
import Express from "express";
import Cron from "node-cron";

const bot = menfessBot;

const app = Express();
const port = process.env.PORT || 5000;

const task = Cron.schedule(
  "*/2 * * * *",
  async () => {
    console.log("session started");
    await bot();
    console.log("session ended");
  },
  { scheduled: false }
);

app.get("/", async (req, res) => {
  res.write("<h1>welcome to pembelajaran bot twitter</h1>");
  res.write("<h4>Initializing bot<h4>");
  res.end();
  task.start();
  res.write("<h4>Task started<h4>");
  res.end();
  console.log("Task started");
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
  // wakeUp.start();
  res.send("Job started");
  console.log("job started");
});

app.get("/stop", async (req, res, next) => {
  task.stop();
  res.send("job stopped");
  console.log("job stopped");
});

app.listen(port, () => {
  console.log(`server is litening to port ${port}`);
});
