import express, { Request, Response } from "express";
import { handleGetLog } from "./service/error_log";
import axios from "axios";
import { calcTime } from "./service/time";
const PORT = 3000;

const app = express();

let lastPing: String = "";

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
