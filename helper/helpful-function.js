const fs = require('fs');
const path = require('path');

exports.ConvertToLocalTime = (date) => {
    date = new Date(date);
    var localOffset = date.getTimezoneOffset() * 60000;
    var localTime = date.getTime();
    date = localTime - localOffset;    
    return date;
}

exports.DeleteFile = (filePath) => {
    if(filePath[0] != '\\') filePath = '\\' + filePath;
    let basePath = path.join(__dirname);
    basePath = basePath.replace(/\\helper/g, '');    
    fs.unlink(basePath + filePath, (err) => {
        if (err) {
            console.log(err);
        }
    });
}

exports.ConvertToPlain = (model) => {
    model = JSON.stringify(model, null, 2);
    model = JSON.parse(model);
    return model;
}

exports.CreateProductCode = (code,number) => {    
    if (number != 0) {
        number++;
        number += '';
        for (let i = 0; i < 4; i++) {
            if (number.length < 4) number = '0' + number;
            else break;
        }
        return code + number;
    }    
    return code + '0001';
}