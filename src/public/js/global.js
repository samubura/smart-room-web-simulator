const socket = io();
const client = axios.create({
  baseURL: window.location.href,
  timeout: 1000,
});

const componentFactory = {}

const components = {}


const $things = $('#things')
