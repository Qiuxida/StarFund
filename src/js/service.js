const axios = require('axios');
const iconv = require("iconv-lite");

function getFundByCode(code){
    return new Promise((resolve, reject) => {
        axios
            .default
            .get(`http://fundgz.1234567.com.cn/js/${code}.js?rt=${new Date().getTime()}`)
            .then(resp =>{
                resolve(resp.data);
            }).catch(error => {
                reject(error);
            })
    })
}

function getIndexByCode(code){
    return new Promise((resolve, reject) => {
        axios
            .default
            .get(`http://hq.sinajs.cn/list=${code}`)
            .then(resp => {
                resolve(resp.data);
            }).catch(error => {
                reject(error);
            })
    })
}

function getFundHistory(code) {
    return new Promise((resolve, reject) => {
        axios
            .default
            .get(`http://fund.eastmoney.com/f10/F10DataApi.aspx?type=lsjz&code=${code}&page=1&per=24`)
            .then(resp => {
                resolve(resp.data);
            }).catch(error => {
                reject(error);
            })
    })
}

function getFundSuggestList(){
    return new Promise((resolve, reject) => {
        axios
            .default
            .get(`http://m.1234567.com.cn/data/FundSuggestList.js`)
            .then(resp => {
                resolve(resp.data);
            }).catch(error => {
                reject(error);
            })
    })
}

function getAllFundInfo(code){
    return new Promise((resolve, reject) => {
        axios
            .default
            .get(`http://fund.eastmoney.com/pingzhongdata/${code}.js`)
            .then(resp => {
                resolve(resp.data);
            }).catch(error => {
                reject(error);
            })
    })
}

function getStockSuggestList(code){
    return new Promise((resolve, reject) => {
        axios
            .default
            .get(`http://suggest3.sinajs.cn/suggest/type=1&key=${code}`,{
                responseType: 'arraybuffer',
                transformResponse: [
                    function (data) {
                        let body = iconv.decode(data, 'GB18030');
                        return body;
                    }
                ]
            })
            .then(resp => {
                resolve(resp.data);
            }).catch(error => {
                reject(error);
            })
    })
}

module.exports = {
    getFundByCode,
    getIndexByCode,
    getFundHistory,
    getFundSuggestList,
    getAllFundInfo,
    getStockSuggestList
}