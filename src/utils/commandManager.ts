import { readdirSync, statSync } from "node:fs";
import path from "node:path";

export type Command = {
    name: string;
    command: string;
    description: string;
    default: Function
};

class CommandManager {
    private commands: Command[] = [];

    constructor() {
        this.commands = [];
        this.loadCommands();
        console.log(`命令加载完成,共有:${this.commands.length}个命令可用`);

    }

    loadCommands() {
        const commandPath = path.join(__dirname, "..", "commands")
        const commandFiles = readdirSync(commandPath);
        for (const commandFile of commandFiles) {
            const command: Command = require(path.join(commandPath, commandFile));
            if (typeof command !== "object") continue;
            this.commands.push(command);
        }
    }

    installCommand() { }

    uninstallCommand() { }

    listCommands() {
        return this.commands;
    }

    getCommand(name: string) {
        return this.commands.find(cmd => cmd.name === name);
    }

    callCommand(name: string) { }
}

export default new CommandManager();