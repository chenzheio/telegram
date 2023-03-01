import axios from "axios";
import { readFileSync, writeFileSync } from "fs";
import { Api } from "telegram/tl";


okexPrice.prototype = {
    command: "p",
    description: "获取OKEX价格"
}

export default async function okexPrice(msg: Api.Message) {

    const { message } = msg;
    try {
        const args = message.split(" ").slice(1);
        let floatPrice = 0;
        let idx = 3;
        if (args[0]) {
            // 如果第一个参数不是数字
            if (isNaN(Number(args[0]))) {
                // 处理设置相关
                if (args[0].toUpperCase() === "F") {
                    floatPrice = Number(process.env.FLOAT_PRICE);
                }
                if (args[0].toUpperCase() === "SET") {
                    if (!args[1]) return msg.edit({
                        text: "请输入正确的参数"
                    })
                    if (isNaN(Number(args[1]))) return msg.edit({
                        text: "请输入正确的参数"
                    })
                    process.env.FLOAT_PRICE = args[1];
                    floatPrice = Number(args[1]);
                    writeFileSync(".env", readFileSync(".env", 'utf-8').replace(/FLOAT_PRICE=.*/g, `FLOAT_PRICE=${args[1]}`));
                    return msg.edit({
                        text: `浮动价格设置成功，当前浮动价格为 -${args[1]}`
                    })
                }
                if (args[0].toUpperCase() === "RF") return msg.edit({
                    text: `当前浮动价格为 -${process.env.FLOAT_PRICE}`
                })
            } else {
                // 如果第一个参数是数字
                idx = Number(args[0]);
                if (args[1] && args[1].toUpperCase() === "F") {
                    floatPrice = Number(process.env.FLOAT_PRICE);
                }
            }
        }
        msg.edit({
            text: "正在获取价格..."
        })
        const { data } = await axios.get(`https://www.okx.com/v3/c2c/tradingOrders/books?t=${Date.now()}&quoteCurrency=cny&baseCurrency=usdt&side=buy&paymentMethod=all&userType=blockTrade&receivingAds=false`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15"
            }
        })
        if (data.code !== 0) {
            return msg.edit({
                text: "获取失败"
            })
        }
        const { data: { buy } } = data
        const { price, quoteSymbol } = buy[idx - 1];

        return msg.edit({
            text: `实时结算价格:${quoteSymbol} ${(Number(price) - floatPrice).toFixed(2)}`
        })
    } catch (error) {
        console.log(error.message);
        return msg.edit({
            text: "获取失败"
        })
    }
}
