const vscode = require('vscode');
const config = require('./config');
const service = require('./service');
const path = require('path');

class CustomTreeViewProvider {

    constructor(){
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    getTreeItem(element) {
        return element;
    } 
        
    async getChildren() {
        let trees = [];
        let funds = config.getFundCodes('starFund');
        let promiseAll = [];
        funds.forEach(fund => {
            if (fund && fund.code)
                promiseAll.push(service.getFundByCode(fund.code));
        });
        let response = await Promise.all(promiseAll);
        let total = 0;
        response.forEach((item,index) => {
            let data = JSON.parse(item.slice(8,-2));
            let t = this.initTreeItem(data,funds[index]);
            trees.push(t.item);
            total += t.profit;
        });
        vscode.window.setStatusBarMessage("今日收益："+total);
        return trees;
    }

    initTreeItem(data,fund){
        let gszzl = parseFloat(data.gszzl);
        let dwjz = parseFloat(data.dwjz);
        let t = new vscode.TreeItem((gszzl>0?"+":"")+data.gszzl+"% " + data.name + "("+data.fundcode+")");
        t.tooltip = "点击查看基金详情";
        t.id = data.fundcode;
        let profit = Math.round(fund.share * gszzl * dwjz)/ 100;
        t.description = "份额:"+ fund.share.toFixed(2) + " 收益:" + profit;
        t.command = {
            title: data.name,
            command: "starFund.open",
            arguments: [data.fundcode,data.name]
        };
        if (gszzl>0){
            t.iconPath = path.join(__filename, '..', '..','..', 'image', 'up.svg')
        }else if (gszzl<0){
            t.iconPath = path.join(__filename, '..', '..','..', 'image', 'down.svg')
        }
        return {item:t,profit: profit};
    }

    refresh(){
        this._onDidChangeTreeData.fire(undefined);
    }
}

exports.CustomTreeViewProvider = CustomTreeViewProvider;