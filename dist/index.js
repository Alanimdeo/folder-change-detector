"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const chokidar_1 = require("chokidar");
const ntfy_1 = require("./ntfy");
const config = JSON.parse((0, fs_1.readFileSync)("./config.json", "utf-8"), (key, value) => key === "$schema" ? undefined : value);
console.log(config);
const watcher = (0, chokidar_1.watch)(config.watchDir, {
    ignored: (f) => f.includes("@eaDir"),
});
console.log("스캔 중...");
watcher.on("ready", () => {
    console.log("스캔 완료. 이제부터 파일 변경을 감지합니다.");
    watcher.on("add", (path) => {
        sendMessage({ message: `${path} 파일이 추가되었습니다.` });
    });
    watcher.on("change", (path) => {
        sendMessage({ message: `${path} 파일이 변경되었습니다.` });
    });
    watcher.on("unlink", (path) => {
        sendMessage({ message: `${path} 파일이 삭제되었습니다.` });
    });
});
watcher.on("error", console.error);
let sendMessage;
if (config.interval === 0) {
    sendMessage = (content) => (0, ntfy_1.send)(config.ntfyAddress, {
        title: content.title || config.defaultTitle || "Photos",
        message: content.message,
    }, config.authentication);
}
else {
    let pendingMessages = [];
    setInterval(() => {
        if (pendingMessages.length === 0)
            return;
        const message = pendingMessages.map((m) => `${m.title ? m.title + " - " : ""}${m.message}`).join("\n");
        (0, ntfy_1.send)(config.ntfyAddress, { title: config.defaultTitle || "Photos", message }, config.authentication);
        pendingMessages = [];
    }, config.interval * 1000);
    sendMessage = (content) => pendingMessages.push(content);
}
