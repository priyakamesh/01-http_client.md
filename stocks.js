'use strict'

const symbol = process.argv[2];
// console.log("symbol",symbol);

const { get } = require('http');
const { readFile } = require('fs');
let parameters = `{
  "Normalized": false,
  "NumberOfDays": 365,
  "DataPeriod": "Day",
  "Elements": [{"symbol":"${symbol}","Type":"price","Params":["c"]}]
}`;
// let stringParameters = JSON.stringify(parameters)
// console.log("stringParameters",stringParameters);
console.log("parameters",parameters);
 get (`http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=${parameters}`,(res)=>{
  const statusCode = res.statusCode;
  const contentType = res.headers['content-type'];
  let error;
  if(statusCode != 200) {
    error = new Error (`Request failed \n statusCode : ${statusCode}`);
  }
  else if (!/^text\/javascript/.test(contentType)){
    error = new Error (`Invalid content type \n ${contentType}`);
  }

  if(error){
    // console.log(error.message);
    // res.on('end',()=>{console.log('not found')});
    res.resume();
    return
  }
  let body = '';
  res.on('data',(buffer)=>{
    // console.log("res.statusCode",res.statusCode);
    body += buffer.toString();
  });
  res.on('end',()=>{
    let bodyParsed = JSON.parse(body);
    // console.log(bodyParsed);
    // console.log(bodyParsed.Elements[0].DataSeries.close.values.length);
    let arrayLength = bodyParsed.Elements[0].DataSeries.close.values.length
    let array = bodyParsed.Elements[0].DataSeries.close.values
    console.log("$"+(array.reduce((acc,val)=>{return acc+val;},0)/arrayLength).toFixed(2));
  });

 });
