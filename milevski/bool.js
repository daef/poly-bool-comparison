const martinez = require('martinez-polygon-clipping')
const fs = require('fs')
const args = process.argv.slice(2)
const g1 = JSON.parse(fs.readFileSync(args[0], 'utf8'))
const g2 = JSON.parse(fs.readFileSync(args[1], 'utf8'))
const m = args[2].toLowerCase()
var result
switch(m) {
    case "x":
        result = martinez.xor(g1, g2)
        break
    case "i":
        result = martinez.intersection(g1, g2)
        break
    case "u":
        result = martinez.union(g1, g2)
        break
    case "d":
        result = martinez.diff(g1, g2)
        break
    default:
        result = martinez.intersection(g1, g2)
        break;
}
console.log(JSON.stringify(result, null, "  "))

