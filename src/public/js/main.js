async function generateInterface(){
  var res = await client.get('workspace')
  var ws = res.data.id
  $('#title').text(ws)
  var res = await client.get('workspace/'+ws+'/things')
  var things = res.data
  //get the tds, order and sort
  for(t of things){
    t.td = await getThingDescription(t.uri)
    t.renderOrder = getRenderOrder()
  }
  things.sort((t1,t2) => t1.renderOrder - t2.renderOrder)
  
  //generate components
  for(t of things) {
    components[t.td.title] = await generateComponent(t)
  }

  registerUpdateManager(components)
}

async function getThingDescription(uri){
  var res = await client.get(uri)
  return res.data
}

function getRenderOrder(type){
  var order = renderOrder.indexOf(type)
  return  order >= 0 ? order : renderOrder.length
}

async function generateComponent(thing){
  var type = thing.td['@type']
  var thingComponent = undefined
  if(type in componentFactory){
    thingComponent = await componentFactory[type].create(thing.td)
  } else {
    thingComponent = await componentFactory["ThingInterface"].create(thing.td);
  }
  return thingComponent
}


//define un UpdateManager that send the event to the right thing component
function registerUpdateManager(components){
  var updateManager = new UpdateManager(socket, components)
  updateManager.startListening();
}


$(document).ready(function(){
  logManager = new LogManager(socket)
  logManager.startListening();
  generateInterface();
})