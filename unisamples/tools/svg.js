const fs = require('fs');
const args = process.argv.slice(2)

const w = (x) => process.stdout.write(x)

var data = JSON.parse(fs.readFileSync(args[0], 'utf8'))

w('<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 500 500">')
w('<path style="fill:#000000; fill-rule: evenodd;" d="')

let state = 'M '
for(let i in data) {
    const poly = data[i]
    for(let j in poly) {
        w(state)
        w(poly[j].join(' '))
        state = ' L '
    }
    state = ' M '
}

w('"/>')
w('</svg>\n')

