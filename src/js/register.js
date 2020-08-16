const vscode = require('vscode');
const config = require('./config');
const manager = require('./manager');
const { CustomTreeViewProvider } = require('./customTreeViewProvider');
const service = require('./service');

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
                description: t[0],
                detail: "",
                label: t[2]+" "+t[3],
                picked: true,
                code: t[0]
            })
        });
        // fundSuggestList =JSON.parse(data);
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
                    config.updateFundCodes("starFund",item.code);
                    provider.refresh();
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
        vscode.commands.registerCommand('starFund.open', (code,name) => {
            manager.getFundHistory(code).then(data => {
                let panel = vscode.window.createWebviewPanel(
                    "fundDetail",
                    name,
                    vscode.ViewColumn.One,
                    {}
                );
                panel.webview.html = getWebviewContent(data);
            });
        })
    )

    manager.initIndexStatus();
    
    vscode.window.registerTreeDataProvider("my-fund",provider);

    setInterval(() => {
        let hour = new Date().getHours();
        if (hour>9 && hour<15){
            provider.refresh();
            manager.initIndexStatus();
        }
	},10000)
}

function getWebviewContent(data) {
    return `<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cat Coding</title>
            </head>
            <style>
                .grn{
                    color: green;
                }
                .red{
                    color: red;
                }
                .bold{
                    font-weight: 700;
                }
                .unbold{
                    font-weight: 400;
                }
                .tor{
                    text-align: right;
                    padding-right: 10px;
                }
                td {
                    height: 16px;
                    line-height: 16px;
                    vertical-align: middle;
                }
            </style>
            <body>
                <h1>历史净值明细</h1>
                <span>${data.content}</span>
            </body>
        </html>`;
  }

exports.registerEvent = registerEvent;