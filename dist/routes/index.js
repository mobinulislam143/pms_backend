"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_route_1 = require("../modules/auth/auth.route");
const express = require('express');
const router = express.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.userRoutes
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
