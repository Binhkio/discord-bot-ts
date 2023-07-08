import express, { Request, Response } from "express";
import axios from "axios";
import { calcTime } from "./service/time";
import { handleGetLog, handleCreateLogFolder } from "./service/error_log";

const app = express();
const PORT = 3000;
let lastPing: String = "";

handleCreateLogFolder();

app.get("/", (req: Request, res: Response) => {
    const logs = handleGetLog();
    res.json({
        title: "Bot is still running right now !!!",
        logs: logs.reverse(),
    });
})

app.get("/ping", (req: Request, res: Response) => {
    console.log("Server is pinged at " + lastPing);
    res.sendStatus(200);
})

export function keepAlive() {
    app.listen(PORT, () => {
        console.log("App is listening on port: " + PORT);
    })
}

setInterval(() => {
    const hostUrl = "http://localhost:3000";
    lastPing = new Date(calcTime()).toString().split(" GMT")[0];
    axios.get(`${hostUrl}/ping`);
}, 1000*5);
