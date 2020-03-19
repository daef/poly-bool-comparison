extern crate clap;
extern crate geo_booleanop_tests;

use clap::{App, AppSettings, Arg, ArgGroup};
use geo::{Coordinate, MultiPolygon, Polygon, LineString};

use geo_booleanop::boolean::BooleanOp;

use std::fs::File;

fn lj(path: &str) -> MultiPolygon<f32> {
    let file = File::open(path).unwrap();
    let data: Vec<Vec<Vec<f32>>> = serde_json::from_reader(file).unwrap();
    let mut polys = Vec::new();
    for p in data {
        let mut pts = Vec::new();
        for c in p {
            pts.push(Coordinate {
                x: c[0],
                y: c[1]
            });
        }
        polys.push(Polygon::new(LineString(pts), vec![]));
    }
    MultiPolygon(polys)
}

fn main() {
    #[rustfmt::skip]
    let matches = App::new("Test case runner")
        .setting(AppSettings::ArgRequiredElseHelp)
        .arg(Arg::with_name("filea")
                 .required(true)
                 .help("Input file A"))
        .arg(Arg::with_name("fileb")
                 .required(true)
                 .help("Input file B"))
        .args_from_usage("-i, --intersect
                          -u, --union
                          -x, --xor
                          -d, --difference")
        .group(ArgGroup::with_name("operation")
               .args(&["intersect", "union", "xor", "difference"])
               .required(true))
        .get_matches();



    let filename_in_a = matches.value_of("filea").unwrap().to_string();
    let filename_in_b = matches.value_of("fileb").unwrap().to_string();
    let a = lj(&filename_in_a);
    let b = lj(&filename_in_b);
    let c = if matches.is_present("intersect") { a.intersection(&b) }
        else if matches.is_present("union") { a.union(&b) }
        else if matches.is_present("xor") { a.xor(&b) }
        else /* matches.is_present("difference") */ { a.difference(&b) };
    let polys = c.0;
    println!("[");
    for (k, poly) in polys.iter().enumerate() {
        let put = |i: &LineString<f32>, reverse: bool| {
            let mut first = true;
            if reverse {
                for p in i.points_iter().rev() {
                    print!("{}[{:?},{:?}]",
                           if first { ""} else { ", " },
                           p.x(), p.y());
                    first = false;
                }
            } else {
                for p in i.points_iter() {
                    print!("{}[{:?},{:?}]",
                           if first { ""} else { ", " },
                           p.x(), p.y());
                    first = false;
                }
            }
        };
        print!("  [");
        put(poly.exterior(), false);
        for pts in poly.interiors() {
            print!("\n  ],[");
            put(pts, true);
        }
        println!("]{}", if k<polys.len()-1 { "," } else { "" });
    }
    println!("]");
}

