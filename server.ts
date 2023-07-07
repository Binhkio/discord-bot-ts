import express from "express";
import { handleGetLog, handleCreateLogFolder } from "./service/error_log";

const server = express();

handleCreateLogFolder();

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
