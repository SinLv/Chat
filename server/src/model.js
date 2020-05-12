const child_process = require('child_process');
const mongoose = require('mongoose');

// 运行mongodb
// child_process.execFile('start_mongodb.bat', null, {cwd: 'D:/软件工具箱/MongoDB'}, function (err) {
//     if (err !== null) {
//         console.log("exec error"+error);
//     } else {
//         console.log('mongodb is start');
//     }
// })
//连接mongo 并且使用imooc这个集合
const DB_URL = 'mongodb://localhost:27017/imooc-chat';
mongoose.connect(DB_URL);
mongoose.connection.on('connected', function () {
    console.log('mongodb is connected');
})

const models = {
    user: {
        user: {type: String, require: true},
        pwd: {type: String, require: true},
        type: {type: String, require: true},
        avatar: {type: String},
        desc: {type: String},
        title: {type: String},
        company: {type: String},
        money: {type: String}
    },
    chat: {
        // 两人建立的聊天id
        chatid: {type: String, require: true},
        // 聊天信息的发送人和接收人
        from: {type: String, require: true},
        to: {type: String, require: true},
        // 信息是否已读
        read: {type: Boolean, default: false},
        // 聊天内容
        content: {type: String, require: true, default: ''},
        // 信息发送时间
        create_time: {type: Number, default: Date.now()}
    }
}

// 创建所有对象的数据表
for (let key in models) {
    mongoose.model(key, new mongoose.Schema(models[key]));
}

module.exports = {
    getModel: function (name) {
        return mongoose.model(name);
    }
}