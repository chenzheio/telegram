import { config } from "dotenv";
config();
import { TelegramClient, Api } from "telegram";
import { StoreSession } from "telegram/sessions";
import { NewMessage, NewMessageEvent } from "telegram/events";
import input from "input";
import commandManager from "./utils/commandManager";
import isCommand from "./utils/commands/isCommand";
import { readFileSync, writeFileSync } from "fs";

(async () => {
    const APPID = 5412427;
    const APP_SECRET = "43fe348f1931fbff51af358cc28c4c1b";
    const storeSession = new StoreSession("session_user");

    const client = new TelegramClient(storeSession, APPID, APP_SECRET
        , {
            connectionRetries: 5
        });

    if (client.session.authKey) {
        await client.connect();
    } else {
        await client.start({
            phoneNumber: async () => await input.text("Enter phone: "),
            password: async () => await input.text("Enter password: "),
            phoneCode: async () => await input.text("Enter phone code: "),
            onError: (err) => console.log(err)
        });
        client.session.save();
    }

    client.addEventHandler(async ({ message: _M }: NewMessageEvent) => {
        const { message } = _M;
        if (!isCommand(message)) return;
        const command = message.split(" ")[0].slice(1);

        if (command.toUpperCase() === "PREFIX") {
            const args = message.split(" ").slice(1);
            if (!args[0]) {
                return _M.edit({
                    text: "请输入需要修改的前缀"
                })
            }
            process.env.COM_PREFIX = args[0];
            writeFileSync(".env", readFileSync(".env", 'utf-8').replace(/COM_PREFIX=.*/g, `COM_PREFIX=${args[0]}`));
            return _M.edit({
                text: `前缀修改成功，当前前缀为${args[0]}`
            })
        }
        const commandList = commandManager.listCommands();
        commandList.forEach((_cmd) => {
            try {
                if (command.toUpperCase() === _cmd.default.prototype.command.toUpperCase()) {
                    _cmd.default(_M);
                }
            } catch (error) {
                console.log(error.message);
            }
        });
    }, new NewMessage({ outgoing: true }));

    client.addEventHandler(async ({ message: _M }: NewMessageEvent) => {

        console.log(_M.message);


    }, new NewMessage({ outgoing: false }));

})();
