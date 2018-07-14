const CalLoc = function (inputdata, refertag) {
    let results = {};
    for (let item_a of Object.keys(inputdata)) {
        let temp = {};
        let weight = 0;
        for (let item_b of refertag) {
            weight = Calweight(inputdata[item_a], inputdata[item_b.EPC]);
            if (temp[`${item_b.Location}`]) {
                temp[`${item_b.Location}`] += weight;
            } else {
                temp[`${item_b.Location}`] = weight;
            }
        }
        results[item_a] = Object.entries(temp).sort( (a, b) => {return a[1] < b[1] });
    }
    return results;
}

const Calweight = function (tag, refer) {
    let weight = 0;
    let power = 0;
    for (let item of refer) {
        power = power + Object.values(item) * Object.values(item);
        for (let item_tag of tag) {
            if ( Object.keys(item)[0] === Object.keys(item_tag)[0] ) {
                weight += Object.values(item_tag) * Object.values(item);
            }
        }
    }
    weight = weight / power;
    return weight;
}

module.exports = CalLoc;