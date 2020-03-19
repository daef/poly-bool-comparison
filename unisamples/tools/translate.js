const fs = require('fs')
const stringify = require("json-stringify-pretty-compact");
const args = process.argv.slice(2)
var data = JSON.parse(fs.readFileSync(args[0], 'utf8'))

var x = parseFloat(args[1])
var y = parseFloat(args[2])

for(const p in data) {
    const poly = data[p]
    for(const v in poly) {
        var vert = poly[v]
        vert[0] += x
        vert[1] += y
    }
}

console.log(stringify(data))

