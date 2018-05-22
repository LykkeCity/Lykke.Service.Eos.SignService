"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const azure_storage_1 = require("azure-storage");
const common_1 = require("../common");
var LogLevel;
(function (LogLevel) {
    LogLevel["error"] = "error";
    LogLevel["warning"] = "warning";
    LogLevel["info"] = "info";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
let LogService = class LogService {
    constructor(settings) {
        this.gen = azure_storage_1.TableUtilities.entityGenerator;
        if (settings.EosSignService.LogsConnectionString) {
            this.azureService = azure_storage_1.createTableService(settings.EosSignService.LogsConnectionString);
        }
        if (settings.SlackNotifications) {
            this.slackService = azure_storage_1.createQueueService(settings.SlackNotifications.AzureQueue.ConnectionString);
        }
    }
    /**
     * Writes log entry to all configured stores (console by default).
     *
     * @param level Log level - `error | warning | info`
     * @param component Component or class or file name
     * @param process Process or method name
     * @param message Event description
     * @param context Event additional data
     * @param type Type of error if any
     * @param stack Stack trace of error if any
     */
    async write(level, component, process, message, context, type, stack) {
        console.log(`${new Date().toISOString()} [${level}] ${component} : ${process} : ${message} : ${stack} : ${context}`);
        if (this.azureService) {
        }
        if (this.slackService) {
        }
    }
};
LogService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [common_1.Settings])
], LogService);
exports.LogService = LogService;
//# sourceMappingURL=logService.js.map