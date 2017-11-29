//过滤器
var filter = {
    //过滤平分米
    m2:(value)=>{
        return !isNaN(value)?/^\d+/.exec(String(value))[0]+'²':'0²';
    },
    //房源类型
    houseType:(value)=>{
        var valNum = Number(value);
        var result = '';
        switch(valNum){
            case 3:
                result = '出租'
                break;
            case 1:
                result = '长租'
                break;
            case 2:
                result = '出售'
                break;
        }
        return result;
    },
    //订单类型
    orderState:(value)=>{
        var valNum = Number(value);
        var result = '';
        switch(valNum){
            case 1:
                result = '未支付'
                break;
            case 2:
                result = '支付成功'
                break;
            case 3:
                result = '转入退款'
                break;
            case 4:
                result = '支付失败'
                break;
            case 5:
                result = '支付审核'
                break;
            case 6:
                result = '退款审核'
                break;
        }
        return result;
    },
    formatDate(date,fmt){
        if(/(y+)/.test(fmt)){
            fmt = fmt.replace(RegExp.$1, (date.getFullYear()+'').substr(4-RegExp.$1.length));
        }
        let o = {
            'M+': date.getMonth()+1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        }
        for(let k in o){    
            let str = o[k]+'';
            if(new RegExp(`(${k})`).test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1)?str:padLeftZero(str));
            }
        }
        return fmt;
    }
};
//
function padLeftZero(str){
    return ('00'+str).substr(str.length);
}

module.exports = filter;