const vscode = require('vscode');

function getFundCodes(key) {
    return vscode.workspace.getConfiguration().get(key);
}

function updateFundCodes(key,fund) {
    if (!fund.code || !fund.share)
        return;
    let funds = getFundCodes(key);
    let flag = false;
    funds.forEach(item => {
        if (item.code == fund.code){
            item.share = fund.share;
            flag = true;
        }
    });
    if (!flag)
        funds.push(fund);
    vscode.workspace.getConfiguration().update(key,funds,true);
}

function deleteFundCode(key,code){
    let funds = getFundCodes(key);
    let index = -1;
    funds.forEach((item,i) => {
        if (item.code==code)
            index = i;
    });
    if (index>0){
        funds.splice(index,1);
        vscode.workspace.getConfiguration().update(key,funds,true);
    }
}

function getTotal(){
    vscode.workspace.getConfiguration().get("total");
}

function setTotal(total){
    let floatTotal = parseFloat(total);
    vscode.workspace.getConfiguration().update("total",total,true);
}

module.exports = {
    getFundCodes,
    updateFundCodes,
    deleteFundCode,
    getTotal,
    setTotal
}