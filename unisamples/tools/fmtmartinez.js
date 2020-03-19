const fs = require('fs')
const stringify = require("json-stringify-pretty-compact");
const args = process.argv.slice(2)
var data = JSON.parse(fs.readFileSync(args[0], 'utf8'))

console.log(data.length)
for(const p in data) {
    const poly = data[p]
    console.log(poly.length-1)
    for(const v in poly) {
        if((Number(v)+1) < poly.length) {
            const vert = poly[v]
            console.log('\t' + vert[0] + ' ' + vert[1])
        }
    }
}

