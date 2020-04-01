var request = new XMLHttpRequest();
request.open('GET', '../comparison.json', true);

document.data = []

request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        var data = request.responseText.split('\n')
        for (let i in data) {
            if(!data[i].length)
                continue
            let o = JSON.parse(data[i])
            let p = o[0].split('_')
            let v = +o[1].replace("inf", 100)
            document.data.push({ a: p[0], b: p[1], op: p[2], who: p[3].replace('+', '_'), metric: p[4], value: v })
        }

        const met = 'PSNR'
        /////// histofoo
        const hd = document.data.filter(entry =>
            entry.metric == met)
        const n = 10
        var hist = []

        var lowest = Number.POSITIVE_INFINITY
        var highest = Number.NEGATIVE_INFINITY
        var tmp
        for (var i in hd) {
            tmp = hd[i].value
            if (tmp < lowest) lowest = tmp;
            if (tmp > highest) highest = tmp;
        }

        const combatants = ['martinez_cgal', 'martinez_cpp', 'milevski', 'voidqk', 'rust-geo-booleanop']
        const delta = highest - lowest
        const step = (delta * 1.001) / n
        let hists = {}

        for (let i in combatants) {
            let c = combatants[i]
            hists[c] = new Array(n).fill(0)
        }

        for (let j in hd) {
            let d = hd[j]
            // a/b|0 jsism for integer // division
            hists[d.who][(d.value - lowest) / step | 0] += 1
        }

        //console.log(hists)
        let a = ''
        for (let i in combatants) {
            let c = combatants[i]
            let h=hists[c]
            a += c
            for(let j=0;j<n;j++)
                a += '\t' + h[met == 'PSNR' ? (n - j) - 1 : j]
            a += '\n'
        }
        console.log(a)

        //////// end histofoo

        document.context.show()
    } else {
        console.warn('datarequest failed sucessfully')
    }
};

request.onerror = function() {
    console.warn('datarequest failed')
};

request.send();

const container = document.getElementById('container')
const polya = document.getElementById('polya')
const polyb = document.getElementById('polyb')
const polyop = document.getElementById('polyop')
const sample = document.getElementById('sample')
const truth = document.getElementById('truth')
const blink = document.getElementById('blink')
var ah = undefined
var bh = undefined

function color(x) {
  x = Math.max(0, Math.min(1, x));
  return `rgb(${[
    34.61 + x * (1172.33 - x * (10793.56 - x * (33300.12 - x * (38394.49 - x * 14825.05)))),
    23.31 + x * (557.33 + x * (1225.33 - x * (3574.96 - x * (1073.77 + x * 707.56)))),
    27.2 + x * (3211.1 - x * (15327.97 - x * (27814 - x * (22569.18 - x * 6838.66))))
  ].map(Math.floor).join(", ")})`;
}

var CreateContext = function() {
    this.samples = [
        "bar", "cross", "empty", "foo", "holed", "polygontwocontours",
        "polygonwithholes", "rectangle1", "rectangle2", "rectangle3",
        "rectangle4", "selfintersecting", "severalcomponents", "some",
        "square", "square2", "square5", "thing", "touchingpoint",
        "tri0", "tri1", "tri2", "tri3", "twointersectingcontours",
    ]

    this.ops = ['D', 'I', 'X', 'U']
    this.op = 'X'

    this.metrics = ['MAE', 'MSE', 'PAE', 'PSNR', 'RMSE']
    this.metric = 'PAE'

    this.combatants = ['martinez_cgal', 'martinez_cpp', 'milevski', 'voidqk', 'rust-geo-booleanop']
    this.combatant = 'rust-geo-booleanop'

    this.show = function() {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        const dat = document.data.filter(entry =>
            //entry.who == this.combatant &&
            entry.metric == this.metric &&
            entry.op == this.op)

        var lowest = Number.POSITIVE_INFINITY
        var highest = Number.NEGATIVE_INFINITY
        var tmp
        for (var i in dat) {
            tmp = dat[i].value
            if (tmp < lowest) lowest = tmp;
            if (tmp > highest) highest = tmp;
        }
        var rainbow = new Rainbow()
        rainbow.setNumberRange(lowest, highest)
        const range = highest - lowest

        var bukkit = []

        const data = dat.filter(entry =>
            entry.who == this.combatant)

        var row = '<div class="dot"></div>'
        for(let i in samples) {
            let a = samples[i]
            row += '<div class="dot header" id="polya_'+a+'" title="' +a+ '" style="background-image:url(../unisamples/pngs/'+a+'.png)"></div>'
        }
        container.innerHTML += '<div class="row">'+row+'</div>'
        for(let i in samples) {
            let b = samples[i]
            const dataa = data.filter(entry => entry.b == b)
            row = '<div class="dot header" id="polyb_'+b+'" title="' +b+ '" style="background-image:url(../unisamples/pngs/'+b+'.png)"></div>'
            for(let j in samples) {
                let a = samples[j]
                const dataab = dataa.filter(entry => entry.a == a)

                let val = dataab.length === 1 ? dataab[0].value : undefined
                val = (val !== 0 && !val) ? 'black' : '#' + rainbow.colorAt(this.metric == 'PSNR' ? val : highest-val)

                var col = a == b ? 'gray' : val

                row += '<div class="dot" data-poly-a="'+a+'" data-poly-b="'+b+'" title="'+ JSON.stringify(dataab).replace(/"/g, "'").replace(/,/g, "\n")+ '" style="background-color:'+col+';background-image:url(../'+this.combatant+'/pngs/' + a  + '_' + b + '_' +this.op+ '.png)"></div>'
            }
            container.innerHTML += '<div class="row">'+row+'</div>'
        }

        const elems = document.getElementsByClassName('dot')
        Array.prototype.forEach.call(elems, el => {
            el.addEventListener('mouseenter', e => {
                if(e.target.classList.contains('header'))
                    return
                if(ah) {
                    ah.classList.remove('polya')
                    bh.classList.remove('polyb')
                }
                a = e.target.dataset.polyA
                b = e.target.dataset.polyB
                polya.src = '../unisamples/pngs/' + a + '.png'
                polyb.src = '../unisamples/pngs/' + b + '.png'
                var url = e.target.style.backgroundImage.slice(5).slice(0,-2)
                sample.src = url
                sample.style.backgroundColor = e.target.style.backgroundColor
                truth.src = '../magick/' + url.slice(url.indexOf('/', 3))
                ah = document.getElementById('polya_' + a)
                bh = document.getElementById('polyb_' + b)
                ah.classList.add('polya')
                bh.classList.add('polyb')
                polyop.innerHTML =
                    this.op == 'X' ? '&#x22bb' :
                    this.op == 'I' ? '&#x2229' :
                    this.op == 'U' ? '&#x222a' :
                    this.op == 'D' ? '&#x224f' : '?'
            })
            //el.addEventListener('mouseleave', e => {
            //    polya.src = undefined
            //    polyb.src = undefined
            //})
        })
    }
    return this
}

window.setInterval(() => {
    blink.src = blink.src == truth.src ? sample.src : truth.src
}, 234)

document.context = CreateContext()

window.onload = function() {
    var ctx = document.context
    var gui = new dat.GUI()
    gui.add(ctx, 'metric', ctx.metrics );
    gui.add(ctx, 'op', ctx.ops );
    gui.add(ctx, 'combatant', ctx.combatants );
    gui.add(ctx, 'show')
};



