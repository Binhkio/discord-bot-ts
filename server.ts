import express from "express";
import { handleGetLog } from "./service/error_log";

const server = express();

server.all("/", (req, res) => {
    const logs = handleGetLog();
    res.json({
        title: "Bot is still running right now !!!",
        logs: logs.reverse(),
    });
})

export function keepAlive() {
    server.listen(3000, () => {
        console.log("Server is running !");
    })
}
