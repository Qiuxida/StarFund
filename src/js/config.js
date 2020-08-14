const vscode = require('vscode');

function getFundCodes(key) {
    return vscode.workspace.getConfiguration().get(key);
}

function updateFundCodes(key,code) {
    if (!code)
        return;
    let codes = getFundCodes(key);
    codes.push(code);
    vscode.workspace.getConfiguration().update(key,codes,true);
}

function deleteFundCode(key,code){
    let codes = getFundCodes(key);
    let index = codes.indexOf(code);
    if (index>0){
        codes.splice(index,1);
        vscode.workspace.getConfiguration().update(key,codes,true);
    }
}

module.exports = {
    getFundCodes,
    updateFundCodes,
    deleteFundCode
}