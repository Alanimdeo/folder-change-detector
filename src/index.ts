import { readFileSync } from "fs";
import { watch } from "chokidar";
import { NtfyAuthentication, NtfyContent, send } from "./ntfy";

export interface Config {
  watchDir: string;
  interval: number;
  ntfyAddress: `http${"s" | ""}://${string}`;
  authentication: NtfyAuthentication;
  defaultTitle?: string;
}

const config: Config = JSON.parse(readFileSync("./config.json", "utf-8"), (key, value) =>
  key === "$schema" ? undefined : value
);
console.log(config);

const watcher = watch(config.watchDir, {
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

let sendMessage: (content: NtfyContent) => any;

if (config.interval === 0) {
  sendMessage = (content) =>
    send(
      config.ntfyAddress,
      {
        title: content.title || config.defaultTitle || "Photos",
        message: content.message,
      },
      config.authentication
    );
} else {
  let pendingMessages: NtfyContent[] = [];
  setInterval(() => {
    if (pendingMessages.length === 0) return;
    const message = pendingMessages.map((m) => `${m.title ? m.title + " - " : ""}${m.message}`).join("\n");
    send(config.ntfyAddress, { title: config.defaultTitle || "Photos", message }, config.authentication);
    pendingMessages = [];
  }, config.interval * 1000);
  sendMessage = (content) => pendingMessages.push(content);
}
