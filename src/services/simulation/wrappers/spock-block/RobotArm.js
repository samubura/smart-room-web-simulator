const ThingWrapper = require("../ThingWrapper");
const exceptions = require('../../../../utils/thing-exceptions')
const axios = require('axios')

const baseURL = "https://api.interactions.ics.unisg.ch/cherrybot"
const auth = "8ba21acd28754314bafab039571ce446"


class RobotArm extends ThingWrapper {

  client
  constructor(id) {
    super(id, 0, false)
    this.client = axios.create({
      baseURL: baseURL,
      headers: {'Authentication': auth}
    });
    
  }

  async mapAction(req, actionName, data) {
    switch (actionName) {
      case 'initialize': 
        await this.initialize()
        return;
      case 'goHigh':
        await this.goHigh()
        return 
      case 'goPiece':
        await this.goPiece()
        return
      case 'goCan':
        await this.goCan()
        return
      case 'takePiece':
        await this.takePiece()
        return
      case 'openGrip':
          await this.openGrip()
          return
      case 'closeGrip':
          await this.closeGrip()
          return
      default:
        exceptions.actionNotFound(this.id, actionName)
    }
  }

  async initialize(){
    await this.client.put('initialize')
    return 
  }

  async goHigh(){
    let body = {
      "target": {
      "coordinate": {
        "x": 400,
        "y": 0,
        "z": 700
      },
      "rotation": {
        "roll": 0,
        "pitch": -90,
        "yaw": 180
      }
    },
      "speed": 350
    }
    await this.client.put('tcp/target', body)
  }

  async goPiece(){
    let body = {
      "target": {
      "coordinate": {
        "x": 270,
        "y": -360,
        "z": 480
      },
      "rotation": {
        "roll": 0,
        "pitch": -180,
        "yaw": 90
      }
    },
      "speed": 350
    }
    await this.client.put('tcp/target', body)

  }

  async takePiece(){
    let body = {
      "target": {
      "coordinate": {
        "x": 270,
        "y": -360,
        "z": 290
      },
      "rotation": {
        "roll": 0,
        "pitch": -180,
        "yaw": 90
      }
    },
      "speed": 350
    }
    await this.client.put('tcp/target', body)
  }

  async goCan(){
    let body = {
      "target": {
      "coordinate": {
        "x": 270,
        "y": 330,
        "z": 480
      },
      "rotation": {
        "roll": 0,
        "pitch": -180,
        "yaw": 90
      }
    },
      "speed": 550
    }
    await this.client.put('tcp/target', body)
  }

  async openGrip(){
    await this.client.put('gripper', 800, {
      headers: {"Content-Type": "application/json"}
    })
  }

  async closeGrip(){
    await this.client.put('gripper', 250, {
      headers: {"Content-Type": "application/json"}
    })
  }
  
}

module.exports.create = (id, env) => new RobotArm(id)