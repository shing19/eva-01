# Training Chatbot on Discord

## Getting started

```sh
nvm use v16.17.0
npm install 
cp .env.example .env
# 填写一下 .env
#
# BOT_TOKEN: bot token
# CLIENT_TOKEN: bot ID
# API_KEY: model API Key
# SECRET_KEY: model Secret Key
# environment: dev | prod | debug
#
npm start
```

## Train your bot

0. 新建频道组【BOT训练场】和【BOT语料库】
1. 在【BOT训练场】和【BOT语料库】分别再新建同名频道 <任意名称>
2. 在【BOT语料库】的新频道里，投喂语料
3. 在【BOT训练场】的新频道里，@bot 对话