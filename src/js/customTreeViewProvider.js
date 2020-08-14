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
        let codes = config.getFundCodes('starFund');
        let promiseAll = [];
        codes.forEach(code => {
            if (code)
                promiseAll.push(service.getFundByCode(code));
        });
        let response = await Promise.all(promiseAll);
        response.forEach(item => {
            let data = JSON.parse(item.slice(8,-2));
            let t = this.initTreeItem(data);
            trees.push(t);
        });
        return trees;
    }

    initTreeItem(data){
        let gszzl = new Number(data.gszzl)
        let t = new vscode.TreeItem((gszzl>0?"+":"")+data.gszzl+"% " + data.name);
        t.tooltip = "点击查看基金详情";
        t.id = data.fundcode;
        t.description = data.fundcode;
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
        return t;
    }

    refresh(){
        this._onDidChangeTreeData.fire(undefined);
    }
}

exports.CustomTreeViewProvider = CustomTreeViewProvider;