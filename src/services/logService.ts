import { Service } from "typedi";
import { isObject, isNullOrUndefined, promisify } from "util";
import { createTableService, createQueueService, TableService, TableUtilities, QueueService } from "azure-storage";
import { Settings } from "../common";

export enum LogLevel {
    error = "error",
    warning = "warning",
    info = "info"
}

@Service()
export class LogService {

    private azureService: TableService;
    private slackService: QueueService;
    private gen = TableUtilities.entityGenerator;

    constructor(settings: Settings) {
        if (settings.EosSignService.LogsConnectionString) {
            this.azureService = createTableService(settings.EosSignService.LogsConnectionString);
        }
        if (settings.SlackNotifications) {
            this.slackService = createQueueService(settings.SlackNotifications.AzureQueue.ConnectionString)
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
    async write(level: LogLevel, component: string, process: string, message: string,
        context?: string, type?: string, stack?: string) {

        console.log(`${new Date().toISOString()} [${level}] ${component} : ${process} : ${message} : ${stack} : ${context}`);

        if (this.azureService) {
        }

        if (this.slackService) {
        }
    }
}