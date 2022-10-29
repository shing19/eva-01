require("dotenv").config();
import { Event } from "../structures/Event"
import { client } from ".."
import { TextChannel } from "discord.js";
import { spawn } from "child_process";

export default new Event("messageCreate", async (message) => {
    const category = (await message.guild.channels.fetch(message.channelId))?.parent.name;
    const channelName = (await message.guild.channels.fetch(message.channelId)).name;
    // 锁定频道类型
    if (category === 'BOT语料库') {
        if ((message.content.match(/：/g) || []).length == 2) {
            message.reply("（吧唧吧唧）捉到训练语料吃掉")
        }
    }
    if (category === 'BOT训练场') {
        // 验证是否是 user 和 bot 的对话
        // if (message.mentions.roles?.find(user => user.tags.botId === process.env.CLIENT_ID)) {
        if (message.mentions.users?.find(user => user.id === process.env.CLIENT_ID)) {
            // 去对应 persona 的语料库
            const persona = channelName?.split("｜")[1]
            const dataChannelName = String(`✍｜${persona}`)
            const dataChannel: TextChannel = message.guild.channels.cache.find(c => c.name === dataChannelName) as TextChannel
            // await dataChannel.send("見つけだ")
            if (!dataChannel) {
                message.reply("这个频道与本 bot 无关")
            } else {
                console.log('对话训练开始');
                let data = [];
                dataChannel.messages.fetch()
                    // 抓合格的训练数据
                    .then((messages) => {
                        messages.filter(msg => msg.author.bot === false).forEach((msg) => {
                            if ((msg.content.match(/：/g) || []).length == 2) {
                                const content = msg.content;
                                if (!data.includes(content)) {
                                    data.push(content);
                                }
                            };
                        });
                        return data
                    })
                    // 抓完开始回复
                    .then((data) => {
                        if (data.length < 1) {
                            message.reply("还没有训练语料，快去投喂");
                        } else {
                            // 处理成 prompt 数据
                            let prompt = [];
                            let promptInput = "有人说：";
                            let promptOutput = "我说：";
                            data.forEach(item => {
                                item = item.replace("：", promptInput);
                                const lastIndex = item.lastIndexOf("：");
                                item = item.substring(0, lastIndex) + promptOutput + item.substring(lastIndex + 1);
                                prompt.push(item);
                            });
                            const input = promptInput + message.content?.split(" ")[1] + "\n" + promptOutput;
                            prompt.push(input);
                            const promptText = prompt.join("\n");
                            console.log(prompt.join("\n"));
                            // 调用模型
                            const childPython = spawn('python', ['./src/models/chatbot.py', promptText]);
                            childPython.stdout.on('data', async (data) => {
                                console.log(`stdout: ${data}`); 
                                let reply = String(data)
                                if (!reply.includes("starts writing") && !reply.includes("wenxin api error")) {
                                    if (reply.includes("：")) {
                                        reply = reply.split("：")[1]
                                    }
                                    message.reply(`${reply}`)
                                }
                            });
                            childPython.stderr.on('data', (data) => {
                                console.error(`stderr: ${data}`);
                            });
                            childPython.on('close', (code) => {
                                console.log(`child process exited with code ${code}`);
                            });
                        }
                    })
                    .catch(console.error)
            }
        }
    }
})