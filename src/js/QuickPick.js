const vscode = require("vscode");
const service = require("./service");

class QuickPick {

    constructor() {
        this.qp = vscode.window.createQuickPick();
        this.qp.onDidChangeValue(this.onDidChangeValue);
        this.qp.onDidChangeSelection(this.onDidChangeSelection);
        this.qp.onDidAccept(this.onDidAccept);
    }

    onDidChangeValue(value) {
        this.qp.busy = true;
        this.qp.items = [{label: "1"}];
        service.getStockSuggestList(value).then(data => {
            console.info(data);
        }).finally(() => {
            this.qp.busy = false;
        })
    }

    onDidChangeSelection(value) {
        console.info(value);
    }

    onDidAccept(value){
        console.info(value);
        this.qp.hide();
	    this.qp.dispose();
    }

    show(){
        this.qp.show();
        
    }
}

exports.QuickPick = QuickPick;