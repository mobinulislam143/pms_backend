"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
router.post('/register', auth_controller_1.AuthController.registerUser);
router.post('/login', auth_controller_1.AuthController.loginUser);
// router.post('/login', login);
exports.userRoutes = router;
