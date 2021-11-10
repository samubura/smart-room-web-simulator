//get all things
const socket = io();
const client = axios.create({
  baseURL: window.location.href,
  timeout: 1000,
});

client.get('/smart-room/things').then(res => {
  console.log(res.data)
})


//generate things components

//subscribe events
socket.on("thing-update", (arg) => {console.log(arg);})