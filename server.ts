import express, { Request, Response } from "express";
import { calcTime } from "./service/time";
import { handleGetLog, handleCreateLogFolder } from "./service/error_log";

const app = express();
const PORT = 3000;
let lastPing: String = "";

handleCreateLogFolder();

app.get("/", (req: Request, res: Response) => {
    const logs = handleGetLog();
    res.json({
        title: "Frog is still awake !!!",
        lastPing: lastPing,
        logs: logs.reverse(),
    });
})

app.get("/ping", (req: Request, res: Response) => {
    lastPing = new Date(calcTime()).toString().split(" GMT")[0];
    res.json({
      status: 200,
    });
})

export function keepAlive() {
    app.listen(PORT, () => {
        console.log("App is listening on port: " + PORT);
    })
}