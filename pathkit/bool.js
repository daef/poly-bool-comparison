const PathKitInit = require('pathkit-wasm/bin/pathkit.js')
const fs = require('fs')
const args = process.argv.slice(2)
const g1 = JSON.parse(fs.readFileSync(args[0], 'utf8'))
const g2 = JSON.parse(fs.readFileSync(args[1], 'utf8'))
const m = args[2].toLowerCase()


PathKitInit().then((PathKit) => {

  function toPath(g) {
    const cmds = [];
    g.forEach((p)=>{
      p.forEach((x,i)=>{
        if(i == 0) {
          return cmds.push([PathKit.MOVE_VERB, x[0], x[1]]);
        } else {
          return cmds.push([PathKit.LINE_VERB, x[0], x[1]]);
        }
      }) 	
    });
  
    let path = PathKit.FromCmds(cmds);
    path.setFillType(PathKit.FillType.EVENODD);
    return path;
  }

  function toPoly(p) {
    const g = [];
    let currentPath = [];
    const cmds = p.toCmds();
    cmds.forEach((cmd)=>{
      if(cmd[0] === PathKit.MOVE_VERB) {
        currentPath = [[cmd[1],cmd[2]]];	
        g.push(currentPath);
      } else if(cmd[0] === PathKit.LINE_VERB){
        currentPath.push([cmd[1],cmd[2]]);
      }
    });
    return g;
  }

  p1 = toPath(g1);
  p2 = toPath(g2);
  let resultPath;
  switch(m) {
    case "x":
      resultPath = p1.copy().op(p2, PathKit.PathOp.XOR);
      break
    case "i":
      resultPath = p1.copy().op(p2, PathKit.PathOp.INTERSECT);
      break
    case "u":
      resultPath = p1.copy().op(p2, PathKit.PathOp.UNION);
      break
    case "d":
      resultPath = p1.copy().op(p2, PathKit.PathOp.DIFFERENCE);
      break
    default:
      resultPath = p1.copy().op(p2, PathKit.PathOp.INTERSECT);
      break;
  }

  const result = toPoly(resultPath);
  console.log(JSON.stringify(result, null, "  "))
});

