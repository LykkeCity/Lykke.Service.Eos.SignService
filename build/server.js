"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typedi_1 = require("typedi");
const routing_controllers_1 = require("routing-controllers");
routing_controllers_1.useContainer(typedi_1.Container);
const koa = routing_controllers_1.createKoaServer({
    classTransformer: true,
    controllers: [`${__dirname}/controllers/*js`],
    routePrefix: "/api",
});
koa.listen(5000);
//# sourceMappingURL=server.js.map