"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const env_1 = require("../env");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const users_1 = require("./models/public/users");
const folders_1 = require("./models/projects/folders");
const projects_1 = require("./models/projects/projects");
const auth_module_1 = require("./services/auth/auth.module");
const projects_module_1 = require("./services/projects/projects.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            projects_module_1.ProjectsModule,
            core_1.DiscoveryModule,
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: "postgres",
                host: env_1.DB.HOST,
                port: env_1.DB.PORT,
                database: env_1.DB.NAME,
                username: env_1.DB.USER,
                password: env_1.DB.PASSWORD,
                synchronize: true,
                entities: [
                    users_1.Users,
                    folders_1.Folders,
                    projects_1.Projects
                ],
            }),
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map