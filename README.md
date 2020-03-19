This is a (very hacky) comparison of various polygon clipping algorithms.

== Method

The 'ground truth' to compare against was approximated via a rasterization of
the polygons (using inkscape) followed by the boolean operations (using graphicsmagick)

Various implementations try to do the boolean operations on the polygons, the resulting
polygons are also translated to svg, rasterized with inkscape and those results are
finally compared on a pixel basis, using various metrics and graphicsmagick.

== Implementations

dissection contains a small viewer for the results

unisamples contain the fixtures as well as conversion tools

magic contains the 'ground truth' build using graphicsmagick

martinez_{cgal,cpp} were build from http://www4.ujaen.es/~fmartin/bop12.zip

milevski uses https://github.com/w8r/martinez

rust-geo-booleanop uses https://github.com/21re/rust-geo-booleanop

voidqk uses https://www.npmjs.com/package/polybooljs


