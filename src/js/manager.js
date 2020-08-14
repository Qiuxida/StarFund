const service = require('./service');
const vscode = require('vscode');

async function initIndexStatus(){
    let data = await service.getIndexByCode("sh000001");
    data = data.split('\"')[1];
    data = data.split(',');
    vscode.window.setStatusBarMessage("上证指数 开盘价"+data[2]+" 收盘价"+data[1]);
}

async function getFundHistory(code){
    let data = await service.getFundHistory(code);
    let apidata = "";
    eval(data.replace("var",""));
    return Promise.resolve(apidata);
}

module.exports = {
    initIndexStatus,
    getFundHistory
}