"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar_1 = __importDefault(require("chokidar"));
const targetDir = "";
const watcher = chokidar_1.default.watch(targetDir, {});
console.log("스캔 중...");
watcher.on("ready", () => {
    console.log("스캔 완료. 이제부터 파일 변경을 감지합니다.");
    watcher.on("add", (path) => {
        sendMessage(`${path} 파일이 추가되었습니다.`);
    });
    watcher.on("change", (path) => {
        sendMessage(`${path} 파일이 변경되었습니다.`);
    });
    watcher.on("unlink", (path) => {
        sendMessage(`${path} 파일이 삭제되었습니다.`);
    });
});
/**
 * 테스트로 급하게 만드느라 console.log로 놔뒀는데, 실 사용 시에는 카카오 API 등과 연동하여 메시지 보내도록 수정하면 될 것 같습니다.
 * @param message 보낼 메시지
 */
function sendMessage(message) {
    console.log(message);
}
