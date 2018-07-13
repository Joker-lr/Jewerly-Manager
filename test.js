let tt = require('fs').readFileSync('./public/testdata/testdata.txt','utf8');
let rawdata = JSON.parse(tt);
let testdata = rawdata.data.tags;
let inputdata = {};
for (let item of testdata) {
    let a ={};
    a[item.antenna] = item.count;
    if (inputdata[`${item.tagId}`]) {
        inputdata[`${item.tagId}`].push(a);
    } else {
        inputdata[`${item.tagId}`] = [a];
    }
}



const db = require('mysql2/promise').createPool({
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root",
    "password": "1234",
    "database": "jtest"
  })

const Loctag = async function(inputdata) {
     let [refertag] = await db.query('SELECT * FROM ReferenceTag');
     console.log(CalLoc(inputdata, refertag));
}
Taglocation = Loctag(inputdata);

const CalLoc = function (inputdata, refertag) {
    let results = {};
    for (let item_a of Object.keys(inputdata)) {
        let temp = {};
        for (let item_b of refertag) {
            let weight = Calweight(inputdata[item_a], inputdata[item_b.EPC]);
            if (temp[item_b.Location]) {
                temp[item_b.location] += weight;
            } else {
                temp[item_b.Location] = weight;
            }
        }
        results[item_a] = temp;
    }
    return results;
}

const Calweight = function (Array1, Array2) {
    return 1;
}