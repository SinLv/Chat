const child_process = require('child_process');
const mongoose = require('mongoose');

// 运行mongodb
child_process.execFile('start_mongodb.bat', null, {cwd: 'D:/软件工具箱/MongoDB'}, function (err) {
    if (err !== null) {
        console.log("exec error"+error);
    } else {
        console.log('mongodb is start');
    }
})
//连接mongo 并且使用imooc这个集合
const DB_URL = 'mongodb://localhost:27017/imooc-chat';
mongoose.connect(DB_URL);
mongoose.connection.on('connected', function () {
    console.log('mongodb is connected');
})
