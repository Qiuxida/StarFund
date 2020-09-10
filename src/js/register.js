const vscode = require('vscode');
const config = require('./config');
const manager = require('./manager');
const service = require('./service');
const path = require('path');
const fs = require('fs');
const { CustomTreeViewProvider } = require('./customTreeViewProvider');
const { QuickPick} = require("./QuickPick");

function registerEvent(context){
    let provider = new CustomTreeViewProvider();
    let fundSuggestList = [];
    service.getFundSuggestList().then(data => {
        data = data.slice(data.indexOf("["),data.indexOf("]")+1);
        let temp = JSON.parse(data);
        temp.forEach(item => {
            let t = item.split("|");
            fundSuggestList.push({
                alwaysShow: true,
                description: t[3],
                detail: "",
                label: t[2]+"("+t[0]+")",
                picked: true,
                code: t[0]
            })
        });
    })
    context.subscriptions.push(
        vscode.commands.registerCommand('starFund.add',() => {
            vscode.window.showQuickPick(
                fundSuggestList,
                {
                    canPickMany:false,
                    ignoreFocusOut:false,
                    matchOnDescription:true,
                    matchOnDetail:true,
                    placeHolder:'请选择基金'
                }
            ).then(item => {
                if (item){
                    vscode.window.showInputBox({prompt: "输入份额"}).then(num => {
                        let share = 0;
                        if (num && !isNaN(share))
                            share = parseFloat(num);
                        config.updateFundCodes("starFund",{code:item.code,share:share});
                        provider.refresh();
                    })
                }
            })
        })
    )
    context.subscriptions.push(
        vscode.commands.registerCommand('starFund.refresh',() => {
            provider.refresh();
        })
    )
    context.subscriptions.push(
        vscode.commands.registerCommand('starFund.delete',(target) => {
            config.deleteFundCode("starFund",target.id);
            provider.refresh();
        })
    )
    context.subscriptions.push(
        vscode.commands.registerCommand('starFund.addShare',(target) => {
            vscode.window.showInputBox({
                prompt:'输入份额'
            }).then(num => {
                config.updateFundCodes("starFund",{code: target.id,share: parseFloat(num)})
                provider.refresh();
            })
        })
    )
    context.subscriptions.push(
        vscode.commands.registerCommand('starFund.open', (code,name) => {
            let promiseAll = [];
            promiseAll.push(manager.getFundHistory(code));
            promiseAll.push(manager.getACWorthTrend(code));
            // @ts-ignore
            Promise.all(promiseAll).then(data => {
                let panel = vscode.window.createWebviewPanel(
                    "fundDetail",
                    name,
                    vscode.ViewColumn.One,
                    {
                        enableScripts: true,
                        localResourceRoots: [
                            vscode.Uri.file(path.join(context.extensionPath, 'node_modules'))
                        ]
                    }
                );
                panel.webview.html = getWebviewContent(data,context);
            });
        })
    )
    context.subscriptions.push(
        vscode.commands.registerCommand('starStock.add',(code, name) => {
            let qp = new QuickPick();
            qp.show();
        })
    )

    let statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    manager.initIndexStatus(statusItem);
    
    vscode.window.registerTreeDataProvider("my-fund",provider);

    setInterval(() => {
        let hour = new Date().getHours();
        if (hour>9 && hour<15){
            provider.refresh();
            manager.initIndexStatus(statusItem);
        }
	},10000)
}

function getWebviewContent(data,context) {
    let resourcePath = path.join(context.extensionPath,"src","html","FundHistory.html");
    let dirPath = path.dirname(resourcePath);
    let html = fs.readFileSync(resourcePath,'utf-8');
    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
        return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
    })
    .replace("${content}",data[0].content)
    .replace("${data}",JSON.stringify(data[1].ac))
    .replace("${perData}",JSON.stringify(data[1].net))
    .replace("${syl_1n}",data[1].syl_1n+"%")
    .replace("${syl_6y}",data[1].syl_6y+"%")
    .replace("${syl_3y}",data[1].syl_3y+"%")
    .replace("${syl_1y}",data[1].syl_1y+"%");
    return html;
}

exports.registerEvent = registerEvent;