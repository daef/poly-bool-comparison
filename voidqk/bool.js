const bool = require('polybooljs');
const fs = require('fs')
const args = process.argv.slice(2)
const g1 = { inverted: false, regions: JSON.parse(fs.readFileSync(args[0], 'utf8')) }
const g2 = { inverted: false, regions: JSON.parse(fs.readFileSync(args[1], 'utf8')) }
const m = args[2].toLowerCase()
var result
switch(m) {
    case "x":
        result = bool.xor(g1, g2)
        break
    case "i":
        result = bool.intersect(g1, g2)
        break
    case "u":
        result = bool.union(g1, g2)
        break
    case "d":
        result = bool.difference(g1, g2)
        break
    default:
        result = bool.intersection(g1, g2)
        break;
}
console.log(JSON.stringify(result, null, "  "))

