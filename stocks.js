'use strict'

const symbol = process.argv[2];
const { get } = require('http');
const { readFile } = require('fs');
let parameters = `{
  "Normalized": false,
  "NumberOfDays": 365,
  "DataPeriod": "Day",
  "Elements": [{"symbol":"${symbol}","Type":"price","Params":["c"]}]
}`;

let url = `http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=${parameters}`;
const getJSON = (url)=>{
  return new Promise ((resolve,reject)=>{
    get(url,(res)=>{
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
    res.resume();
    return
  }
  let body = '';
  res.on('data',(buffer)=>{
    body += buffer.toString();
  });
  res.on('end',()=>{
    // var bodyParsed = JSON.parse(body);
    resolve(JSON.parse(body))
    });

    });
  });

};

  getJSON(url)
  .then((data)=>{
    // console.log(data)
    let arrayLength = data.Elements[0].DataSeries.close.values.length
    // console.log("arrayLength",arrayLength);
    let array = data.Elements[0].DataSeries.close.values
    console.log("$"+(array.reduce((acc,val)=>{return acc+val;},0)/arrayLength).toFixed(2));
  })
