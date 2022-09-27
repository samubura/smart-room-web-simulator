const ThingInterface = require("../ThingInterface");

const axios = require('axios')
const hueBridgeIP = "http://192.168.43.120"
const hueDevID = "w9r9zGUe0RmhErVq-0rnPc7yrdr70LlsreHpjqqQ" 

class HttpHueLamp extends ThingInterface {

  color = undefined
  state = undefined

  lampIndex = undefined

  constructor(lampIndex) {
    super()
    this.lampIndex = lampIndex
  }

  async getRealLampProperties() {
    let url = `${hueBridgeIP}/api/${hueDevID}/lights/${this.lampIndex}`
    let res = await axios.get(url)
    let lamp = res.data.state
    if(!this.color || lamp.on){
      //if the lamp is off color is not correctly changed so it might be wrong unless color is undefined
      this.color = HueColorToHex(lamp.hue, lamp.sat, lamp.bri)
    }
    this.state = lamp.on
    return {
      color: this.color,
      state: this.state
    }
  }

  async getState() {
    await this.getRealLampProperties()
    return this.state
  }

  async getColor() {
    await this.getRealLampProperties()
    return this.color
  }

  async toggle(){
    await this.getState()
    this.state = !this.state
    //changing color because it might have been changed while the lamp was off
    let color = HexToHueColor(this.color)
    let url = `${hueBridgeIP}/api/${hueDevID}/lights/${this.lampIndex}/state`
    let body = {
      on: this.state,
      hue: color[0],
      sat: color[1],
      bri: color[2]
    }
    await axios.put(url, body)
    return this.state
  }

  async setColor(hex){
    this.color = hex
    let color = HexToHueColor(hex)
    let url = `${hueBridgeIP}/api/${hueDevID}/lights/${this.lampIndex}/state`
    let body = {
      hue: color[0],
      sat: color[1],
      bri: color[2]
    }
    await axios.put(url, body)
    return {color: hex};
  }
}

function HSVtoRGB(H, S, V)
{
    var mix = function(a, b, v)
    {
        return (1-v)*a + v*b;
    }
    var V2 = V * (1 - S);
    var r  = ((H>=0 && H<=60) || (H>=300 && H<=360)) ? V : ((H>=120 && H<=240) ? V2 : ((H>=60 && H<=120) ? mix(V,V2,(H-60)/60) : ((H>=240 && H<=300) ? mix(V2,V,(H-240)/60) : 0)));
    var g  = (H>=60 && H<=180) ? V : ((H>=240 && H<=360) ? V2 : ((H>=0 && H<=60) ? mix(V2,V,H/60) : ((H>=180 && H<=240) ? mix(V,V2,(H-180)/60) : 0)));
    var b  = (H>=0 && H<=120) ? V2 : ((H>=180 && H<=300) ? V : ((H>=120 && H<=180) ? mix(V2,V,(H-120)/60) : ((H>=300 && H<=360) ? mix(V,V2,(H-300)/60) : 0)));

    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ]
}

function rgb2hsv(r,g,b) {
  let v=Math.max(r,g,b), c=v-Math.min(r,g,b);
  let h= c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c)); 
  return [60*(h<0?h+6:h), v&&c/v, v];
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}

function rgbToHex(rgb) {
  var componentToHex = function(c){
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}

function HueColorToHex(hue, saturation, brightness){
  let h = hue/65535.0*360
  let s = saturation/254.0
  let v = brightness/254.0
  var rgb = HSVtoRGB(h,s,v)
  return rgbToHex(rgb)
}

function HexToHueColor(hex){
  var rgb = hexToRgb(hex)
  var hsv = rgb2hsv(rgb[0], rgb[1], rgb[2])
  hsv[0] = Math.round(hsv[0]/360.0 * 65535)
  hsv[1] = Math.round(hsv[1]*255)
  hsv[1] == 255 ? 254 : hsv[1]
  hsv[2] = hsv[2] == 255 ? 254 : hsv[2]
  return hsv
}

module.exports = HttpHueLamp