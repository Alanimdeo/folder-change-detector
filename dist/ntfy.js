"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = void 0;
const axios_1 = __importDefault(require("axios"));
async function send(url, content, authentication) {
    const requestConfig = {
        method: "POST",
        url,
        data: content.message,
        headers: {
            Title: content.title || "Photos",
        },
    };
    if (authentication.enabled) {
        requestConfig.auth = {
            username: authentication.username,
            password: authentication.password,
        };
    }
    return await (0, axios_1.default)(requestConfig);
}
exports.send = send;
