const socket = io();
const client = axios.create({
  baseURL: window.location.href,
  timeout: 1000,
  headers: {
    common: {
      "x-agent-id": 'web-ui'
    }
  }
});

const componentFactory = {}

const components = {}


const $things = $('#things')
