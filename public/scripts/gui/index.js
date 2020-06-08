window.world =null
//const b2Vec2 = Box2D.Common.Math.b2Vec2
//const b2AABB = Box2D.Collision.b2AABB
//const b2BodyDef = Box2D.Dynamics.b2BodyDef
//const b2Body = Box2D.Dynamics.b2Body
//const b2FixtureDef = Box2D.Dynamics.b2FixtureDef
//const b2Fixture = Box2D.Dynamics.b2Fixture
//const b2World = Box2D.Dynamics.b2World
//const b2MassData = Box2D.Collision.Shapes.b2MassData
//const b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
//const b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
//const b2DebugDraw = Box2D.Dynamics.b2DebugDraw
//const b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef
const WORLDSCALE = 30
const STAGE_WIDTH = 640 
const STAGE_HEIGHT= 480 

export const initialize = () =>{
  console.log("start")
  world = new b2World(new b2Vec2(0, 9.8))
  console.log("world", window)

  const fixDef = new b2FixtureDef()
  fixDef.density = 0.1 
  fixDef.friction = 0.8
  fixDef.restitution = 0.3 
  fixDef.shape = new b2PolygonShape()
  console.log("shape",fixDef.shape)
  const fixW = 600 / WORLDSCALE
  const fixH = 1 / WORLDSCALE
  fixDef.shape.SetAsBoxXYCenterAngle(fixW , fixH, new b2Vec2(fixW/2,fixH/2), 30/180*Math.PI)

  const boundBodyDef = new b2BodyDef()
  boundBodyDef.type = b2_staticBody
  boundBodyDef.position.Set(0 , 400 / WORLDSCALE)

  const boundBody = world.CreateBody(boundBodyDef)
  const bound = boundBody.CreateFixtureFromDef(fixDef)


  const ballFixDef = new b2FixtureDef()
  ballFixDef.shape = new b2CircleShape()
  ballFixDef.shape.radius = 30 / WORLDSCALE
  const ballBodyDef = new b2BodyDef()
  ballBodyDef.type = b2_dynamicBody
  ballBodyDef.position.x = 300 / WORLDSCALE
  ballBodyDef.position.y = 30 / WORLDSCALE
  const ballBody = world.CreateBody(ballBodyDef)
  ballBody.SetMassData(new b2MassData(1, new b2Vec2(0, 0), 0.03));
  const ball = ballBody.CreateFixtureFromDef(ballFixDef)

  console.log("position", ball.body.GetPosition())
  console.log("bound", bound.shape.vertices)

  const canvas_ = document.getElementById("draw")
  canvas_.width =  STAGE_WIDTH
  canvas_.height =  STAGE_HEIGHT
  const ctx = canvas_.getContext("2d");

  const draw = () =>{
    ctx.clearRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT)
    ctx.beginPath()
    ctx.rect(0, 0, STAGE_WIDTH, STAGE_HEIGHT)
    ctx.stroke()
    const b = bound.shape.vertices
    const g = bound.body.GetPosition()
    const vlist = b.map(v=>[ (g.x+v.x)*WORLDSCALE, (g.y+v.y)*WORLDSCALE])
    ctx.beginPath()
    ctx.moveTo(vlist[0][0], vlist[0][1])
    ctx.lineTo(vlist[1][0], vlist[1][1])
    ctx.lineTo(vlist[2][0], vlist[2][1])
    ctx.lineTo(vlist[3][0], vlist[3][1])
    ctx.closePath()
    ctx.fillStyle = "green"
    ctx.fill()
    ctx.strokeStyle="blue"
    ctx.stroke()

    const p = ball.body.GetPosition()
    ctx.beginPath()
    ctx.arc(p.x*WORLDSCALE, p.y*WORLDSCALE, 30, 0, 2*Math.PI, 0)
    ctx.fillStyle = "red"
    ctx.fill()
    ctx.strokeStyle = "black"
    ctx.stroke()

  }
  draw()

  const update = () => {
    world.Step(1/60, 10, 10)
    draw()

  }
  window.setInterval(update, 1000 / 60);
}

