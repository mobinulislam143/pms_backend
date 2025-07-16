"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const jwtHelper_1 = require("../../helper/jwtHelper");
const prisma_1 = __importDefault(require("../../shared/prisma"));
// import { generateToken } from '../../utils/jwt';
const bcrypt = __importStar(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const http_status_1 = __importDefault(require("http-status"));
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (existingUser) {
        throw new ApiError_1.default(400, "User already exists");
    }
    const hashPassword = yield bcrypt.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    const result = yield prisma_1.default.user.create({
        data: Object.assign(Object.assign({}, payload), { password: hashPassword }),
    });
    const accessToken = jwtHelper_1.jwtHelpers.generateToken({
        id: result.id,
        email: result.email,
        role: result.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return { data: result, token: accessToken };
});
const loginService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existinguser = yield prisma_1.default.user.findUnique({
        where: { email: payload.email }
    });
    if (!(existinguser === null || existinguser === void 0 ? void 0 : existinguser.email)) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found! with this email" + payload.email);
    }
    const isCorrectedpassword = yield bcrypt.compare(payload.password, existinguser.password);
    if (!isCorrectedpassword) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Password Incorrect!");
    }
    const accessToken = jwtHelper_1.jwtHelpers.generateToken({
        id: existinguser.id,
        email: existinguser.email,
        role: existinguser.role
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return { data: existinguser, token: accessToken };
});
exports.AuthService = {
    registerUser,
    loginService
};
