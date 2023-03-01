export default function isCommand(message: string) {
    return message.startsWith(process.env.COM_PREFIX || "~")
};