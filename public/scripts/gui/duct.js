window.world =null 

import {MiniJscad} from "../minijscad/index.js"

let miniJscad = null
console.log(PIXI)
const app = new PIXI.Application({width:800, height:600, backgroundColor:"0x000000"})
document.getElementById("cad").appendChild(app.view)

let bound = new PIXI.Graphics()
let dyna = new PIXI.Graphics()
let particle = new PIXI.Graphics()

app.stage.addChild(bound)
app.stage.addChild(dyna)
app.stage.addChild(particle)

const WORLDSCALE = 100
const STAGE_WIDTH = 640 
const STAGE_HEIGHT= 480 

const boundMap = new Map()
const dynamicMap = new Map()
const liquidMap = new Map()


const colorList = ["red","green", "orange", "yellow"]

const  boundsNodes = [[-2, 0], [2, 0], [2, 4], [-2, 4]]; //  境界形状
const floaters = [
  {nodes:[[-0.1, -0.2],[0.1, -0.2],[0.1, 0.2],[-0.1, 0.2]], pos:[0.5, 2]},
  {nodes:[[0, 0.2],[0.1732, -0.0866],[-0.1732, -0.0866]], pos:[-1.5, 3]}
]

const pgDefs = [      //  particleGroup毎の初期形状
  {nodes:[[0.5, 0.1], [1.9, 0.1], [1.9, 2.5], [0.5, 1.0]]},
//  {nodes:[[-0.5, 0.1], [-1.9, 0.1], [-1.9, 2.5], [-0.5, 1.0]]}
]

const setUpWorld = () => {
  const gravity = new b2Vec2(0, -10)
  world = new b2World(gravity)

  //bound
  const bd = new b2BodyDef()
  const boundBody = world.CreateBody(bd)
  const boxShape = new b2ChainShape()
  boxShape.vertices = boundsNodes.map(v=>new b2Vec2(v[0],v[1]))
  boxShape.CreateLoop()
  const boundFixture = boundBody.CreateFixtureFromShape(boxShape, 0)
  boundMap.set("boundBody", boundFixture)
  
  //dynamic body
  floaters.forEach((floater, i)=>{
    const dynamicBodyDef = new b2BodyDef()
    dynamicBodyDef.type = b2_dynamicBody
    const body = world.CreateBody(dynamicBodyDef)
    //const shape = new b2ChainShape()
    const shape = new b2PolygonShape()
    shape.vertices = floater.nodes.map(v=>new b2Vec2(...v)) 
    //shape.CreateLoop()
    const bodyFixture = body.CreateFixtureFromShape(shape, 1)
    body.SetTransform(new b2Vec2(...floater.pos), 0)
    body.SetMassData(new b2MassData(0.1, new b2Vec2(0, 0), 0.03))
    //body.SetMassFromShapes()
    const name = "dynamicBody" + i 
    dynamicMap.set(name, bodyFixture)
  })

  // liquid 
  const psd = new b2ParticleSystemDef()
  psd.radius = 0.025
  psd.dampingStrength = 0.2
  const particleSystem = world.CreateParticleSystem(psd)
  pgDefs.forEach(def=>{
    const pd = new b2ParticleGroupDef()
    pd.flags =b2_waterParticle 
//    shape.vertices = def.nodes.map(v=>new b2Vec2(v[0], v[1]))
    const shape = new b2PolygonShape()
    shape.SetAsBoxXYCenterAngle(0.8, 1, new b2Vec2(-1.2, 1.01),0)
    pd.shape = shape
    particleSystem.CreateParticleGroup(pd)

  })
  liquidMap.set("liquid", particleSystem)


}

const drawPolygonObj = (obj, graphic, color) => {
    const vertices = obj.shape.vertices 
    const pos = obj.body.GetPosition()
    //const p = [].concat(...vertices, vertices[0]).map(u=>[u.x+pos.x, u.y+pos.y])
    const p = vertices.map(u=>[u.x+pos.x+2, 4-(u.y+pos.y)])
    const P = p.flatMap(u=>[u[0]*WORLDSCALE, u[1]*WORLDSCALE])
    //const id = miniJscad.sketch.addFig("polyline", {points:P})
    graphic.beginFill(color);
    graphic.drawPolygon(P);
    graphic.endFill();
}


const drawParticle = obj => {
  const bur = obj.GetPositionBuffer()
  obj.particleGroups.forEach((v,index)=>{
    const color = colorList[index]
    const offset = v.GetBufferIndex()
    const length = v.GetParticleCount()

    for(let i=offset*2; i<(offset+length)*2;i=i+2){
      const c = [(bur[i]+2)*WORLDSCALE, (4-bur[i+1])*WORLDSCALE]
      const r = 0.025* WORLDSCALE
      particle.beginFill(0xDE3249, 1);
      particle.drawCircle(c[0], c[1], r);
      particle.endFill();
//      const id = miniJscad.sketch.addFig("circle", {center:c, radius: r},{color:color})
    }
  })
}

const drawInitialize = () => {
  //miniJscad = new MiniJscad("cad", 800, 500, false).hideEventObject()
  //miniJscad.sketch.setBackgroundColor("white")

  boundMap.forEach(v=> drawPolygonObj(v,dyna, "0x000000"))

  // miniJscad.sketch.addSheet("sheet1")
}

const draw = () => {
  //miniJscad.sketch.clearSheet("sheet1")
  dyna.clear()
  particle.clear()
  dynamicMap.forEach(v=>drawPolygonObj(v, dyna,"0xAAAAAA"))
  liquidMap.forEach(v=>drawParticle(v))
}

let start = null

const update = (timestamp) => {
  if (!start) start = timestamp
  const progress = timestamp - start
  world.Step(progress/1E3, 10, 10)
  start = timestamp
  draw()
/ window.requestAnimationFrame(update)
}

export const initialize = () => {
  setUpWorld()
  drawInitialize()
  window.requestAnimationFrame(update)
}

