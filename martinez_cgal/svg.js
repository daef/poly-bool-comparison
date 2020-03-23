const fs = require('fs');
const args = process.argv.slice(2)

const w = (x) => process.stdout.write(x)

let line = 0
var data = fs.readFileSync(args[0], 'utf8').split('\n')
const nextline = () => data[line++]

const npoly = +nextline()

w('<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 500 500">')
w('<path style="fill:#000000" fill-rule="evenodd" d="')

let state = 'M '
for(let i=0;i<npoly;i++) {
    const nvert = +nextline()
    for(let v=0;v<nvert;v++) {
        w(state)
        w(nextline().substr(1))
        state = ' L '
    }
    state = ' M '
}

w('"/>')
w('</svg>\n')

