const fs = require('fs')
const stringify = require("json-stringify-pretty-compact");
const args = process.argv.slice(2)
var data = JSON.parse(fs.readFileSync(args[0], 'utf8'))

var aabb = [
    Number.POSITIVE_INFINITY, //min x
    Number.POSITIVE_INFINITY, //min y
    Number.NEGATIVE_INFINITY, //max x
    Number.NEGATIVE_INFINITY] //max y

for(const p in data) {
    const poly = data[p]
    
    if ( JSON.stringify(poly.slice(0, 1)) !== JSON.stringify(poly.slice(-1)) ) {
        console.error("[WARN] fixing first==last in " + args[0])
        poly.push(poly.slice(0, 1))
    }

    for(const v in poly) {
        const vert = poly[v]
        aabb[0] = Math.min(aabb[0], vert[0])
        aabb[1] = Math.min(aabb[1], vert[1])
        aabb[2] = Math.max(aabb[2], vert[0])
        aabb[3] = Math.max(aabb[3], vert[1])
    }
}

const ex = [ aabb[2] - aabb[0], aabb[3] - aabb[1] ]
const aspect = ex[0]/ex[1] // <1 when vertical, >1 when horizontally dominated, 1 when square

const target = [300, 300]

var factor = (aspect > 1
    ? [ target[0] / ex[0], target[1] / (aspect * ex[1]) ]
    : [ target[0] * aspect / ex[0], target[1] / ex[1] ])

for(const p in data) {
    const poly = data[p]
    for(const v in poly) {
        var vert = poly[v]
        vert[0] *= factor[0]
        vert[1] *= factor[1]
    }
}
console.log(stringify(data))

