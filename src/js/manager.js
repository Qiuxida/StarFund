const service = require('./service');

async function initIndexStatus(statusItem){
    let data = await service.getIndexByCode("sh000001");
    data = data.split('\"')[1];
    data = data.split(',');
    statusItem.tooltip = "上证指数:"+data[3]+"\n"+
                        "今收："+data[1]+" 昨收："+data[2]+"\n"+
                        "最高："+data[4]+" 最低："+data[5];
    statusItem.text = "上证指数:"+data[3];
    statusItem.show();
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