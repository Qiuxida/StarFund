const vscode = require('vscode');
const config = require('./config');
const manager = require('./manager');
const { CustomTreeViewProvider } = require('./customTreeViewProvider');

function registerEvent(context){
    let provider = new CustomTreeViewProvider();

    context.subscriptions.push(
        vscode.commands.registerCommand('starFund.add',() => {
            vscode.window.showInputBox({prompt: '请输入基金代码'}).then(code => {
                config.updateFundCodes("starFund",code);
                provider.refresh();
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