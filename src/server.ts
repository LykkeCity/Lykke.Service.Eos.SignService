import "reflect-metadata";
import { Container } from "typedi";
import { createKoaServer, useContainer } from "routing-controllers";

useContainer(Container);

const koa = createKoaServer({
    classTransformer: true,
    controllers: [`${__dirname}/controllers/*js`],
    routePrefix: "/api",
});

koa.listen(5000);