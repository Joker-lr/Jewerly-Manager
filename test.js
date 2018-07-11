let testdata = {"type":2001,"data":[{"cabinet":"柜号1","tagIds":"CCCC11700000020A2C5F716E, CCCC11700000020A2C6040C0, CCCC11700000020A2C5F930E"},{"cabinet":"柜号2","tagIds":"DDDD0025, DDDD0034, DDDD0020"},{"cabinet":"柜号3","tagIds":"AAAA0009, AAAA0081, AAAA0084"},{"cabinet":"柜号4","tagIds":"BBBB11700000020A2C5F455D, BBBB11700000020A2C5FA490, BBBB11700000020A2C5FAD6F"},{"cabinet":"柜号5","tagIds":"E28011700000020A2C5F09E9, E28011700000020A2C606290, E28011700000020A2C5F92D2"}]};
data = {};
testdata["data"].map(function(item){ data[item["cabinet"]] = item["tagIds"].split(", ") });
console.log(data)
// console.log(Object.entries(data).map(function(item){return [item[0], item[1].split(", ")]}));
// var s = JSON.stringify(testdata);
// console.log(JSON.parse(s));
