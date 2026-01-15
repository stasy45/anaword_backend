"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../env");
const cookieParser = require("cookie-parser");
const express = require("express");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const error_boundary_filter_1 = require("./utils/error-boundary.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        exceptionFactory: (errors) => {
            const result = {};
            for (const error of errors) {
                const constraints = error.constraints;
                if (constraints) {
                    const [firstConstraint] = Object.values(constraints);
                    result[error.property] = firstConstraint;
                }
            }
            return new common_1.BadRequestException(result);
        },
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new error_boundary_filter_1.ErrorBoundaryFilter());
    app.use(cookieParser());
    app.use(express.json({ strict: false }));
    await app.listen(env_1.APP_PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map