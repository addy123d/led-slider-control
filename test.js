// const { Board, Thermometer } = require("johnny-five");
// const board = new Board();

// board.on("ready", () => {

//     const thermometer = new Thermometer({
//       controller: "LM35",
//       pin: "A0"
//     });


//     thermometer.on("change", () => {
//       const {celsius, fahrenheit, kelvin} = thermometer;
//       console.log("Thermometer");
//       console.log("  celsius      : ", celsius);
//       console.log("  fahrenheit   : ", fahrenheit);
//       console.log("  kelvin       : ", kelvin);
//       console.log("--------------------------------------");
//     });

// });

const {Board, Servo, Leds} = require("johnny-five");
// const keypress = require("keypress");
// const {
//     EtherPortClient
//   } = require('etherport-client');
// const five = require('johnny-five');
// keypress(process.stdin);

// const board = new five.Board({
//     port: new EtherPortClient({
//       host: '192.168.43.102',

//       port: 3030
//     }),
//     repl: false
//   });

const board = new Board();


  
board.on("ready", () => {


  const express = require("express");
  const webSocket = require("ws");
  const port = 5500;
  const host = "127.0.0.1";

  let app = express();

  const ledArr = [];
  app.use(express.json());
  app.use(express.urlencoded({extended:false}));
  app.use("/",express.static(__dirname+"/public"));



  app.post("/getValues",function(request,response){
    console.log(request.body);

    const {value,behaviour} = request.body;

    const user = {value,behaviour}

    ledArr.push(value);

    console.log("LED ARRAY : ",ledArr);
    const leds = new Leds(ledArr);
    leds.on();

    response.json({
      "result" : "cool"
    });

  });


  app.get("/off",function(request,response){
    console.log("Off........ !");
    const leds = new Leds([2,3,4,5,6,9,10,11]);
    leds.off();
    response.json({
      "success" : "badhiya !"
    })
  })

  app.post("/offLeds",(request,response)=>{
    console.log(request.body);
    const {value} = request.body;
    const leds = new Leds([2,3,4,5,6,9,10,11]);
    if (value === 1) {
      leds.off();
    } else {
      leds.each((led, index) => {
        if (index <= value) {
          led.on();
        } else {
          led.off();
        }
      });
    }
  })


  const server = app.listen(port,host,()=>{
    console.log("Our HTTP Server is running successfully !");
  });

  // let ledArr = [3,5,6,9,10,11];
  // // missing = 4,7,8
  // const leds = new Leds(ledArr);
  // leds.pulse();
  // console.log("Use Up and Down arrows for CW and CCW respectively. Space to stop.");

  // const servo = new Servo.Continuous(2);

  // process.stdin.resume();
  // process.stdin.setEncoding("utf8");
  // process.stdin.setRawMode(true);

  // process.stdin.on("keypress", (ch, key) => {

  //   if (!key) {
  //     return;
  //   }

  //   if (key.name === "q") {
  //     console.log("Quitting");
  //     process.exit();
  //   } else if (key.name === "up") {
  //     console.log("CW");
  //     servo.cw();
  //   } else if (key.name === "down") {
  //     console.log("CCW");
  //     servo.ccw();
  //   } else if (key.name === "space") {
  //     console.log("Stopping");
  //     servo.stop();
  //   }
  // });
});