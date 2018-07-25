const CalLoc = function (inputdata, refertag) {
    let results = {};
    for (let item_a of Object.keys(inputdata)) {
        let temp = {};
        let weight = 0;
        for (let item_b of refertag) {
            if(inputdata[item_b.epc]) {
                weight = Calweight(inputdata[item_a], inputdata[item_b.epc]);
                if (temp[`${item_b.location}`]) {
                    temp[`${item_b.location}`] += weight;
                } else {
                    temp[`${item_b.location}`] = weight;
                }
            }
            
        }
        results[item_a] = Object.entries(temp).sort( (a, b) => {return a[1] < b[1] });
    }
    return results;
}

const Calweight = function (tag, refer) {
    let weight = 0;
    let power = 0;
    // console.log(refer)
    for (let item of refer) {
        power = power + Object.values(item) * Object.values(item);
        for (let item_tag of tag) {
            if ( Object.keys(item)[0] === Object.keys(item_tag)[0] ) {
                weight += Object.values(item_tag) * Object.values(item);
            }
        }
    }
    // weight = weight / power;
    weight = weight / Math.sqrt(power);
    return weight;
}

module.exports = CalLoc;