"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const errors_1 = __importDefault(require("../errors"));
const authentication = (req, res, next) => {
    try {
        const token = req.signedCookies.token;
        if (!token) {
            throw new errors_1.default.UnauthorizedError('Missing Token');
        }
        const decoded = (0, utils_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        throw new errors_1.default.UnauthorizedError('Failed to Authenticate User');
    }
};
exports.default = authentication;
