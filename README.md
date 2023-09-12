This is a (very hacky) comparison of various polygon clipping algorithms.

[shut up and take me to the damn thing](https://daef.github.io/poly-bool-comparison/dissection/)

## method

The 'ground truth' to compare against was approximated via a rasterization of
the polygons (using inkscape) followed by the boolean operations (using graphicsmagick)

Various implementations try to do the boolean operations on the polygons, the resulting
polygons are also translated to svg, rasterized with inkscape and those results are
finally compared on a pixel basis, using various metrics and graphicsmagick.

## dir description

[dissection](https://github.com/daef/poly-bool-comparison/tree/master/dissection) contains a small viewer for the results

[unisamples](https://github.com/daef/poly-bool-comparison/tree/master/unisamples) contain the fixtures as well as conversion tools

[magick](https://github.com/daef/poly-bool-comparison/tree/master/magick) contains the 'ground truth' build using graphicsmagick

## algorithms

martinez_{[cgal](https://github.com/daef/poly-bool-comparison/tree/master/martinez_cgal),[cpp](https://github.com/daef/poly-bool-comparison/tree/master/martinez_cpp)} were build from http://www4.ujaen.es/~fmartin/bop12.zip

[milevski](https://github.com/daef/poly-bool-comparison/tree/master/milevski) uses https://github.com/w8r/martinez

[rust-geo-booleanop](https://github.com/daef/poly-bool-comparison/tree/master/rust-geo-booleanop) uses https://github.com/21re/rust-geo-booleanop

[voidqk](https://github.com/daef/poly-bool-comparison/tree/master/voidqk) uses https://www.npmjs.com/package/polybooljs

## dependencies

this is far from packed for re-use, but if you insist, the main dependencies should be node, graphicsmagick and inkscape

graphicsmagick can be downloaded (source) and compiled into a set of command line utilities. See http://www.graphicsmagick.org/README.html

inkscape can be downloaded and installed. See https://inkscape.org

## running

install LTS versions of [npm](https://www.npmjs.com/) and [node.js](https://nodejs.org/en/)

now run these commands inside the poly-bool-comparison directory
```
npm install
npm run setup
```

to re-run everything try running `./run`... good luck ;)

to update a single algorithm run `./run <dirname>`

