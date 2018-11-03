var http = require("http");

http.createServer(function (request, response) {
   // Send the HTTP header 
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body as "Hello World"
   response.end('Hello World\n');
}).listen(8083);

// Console will print the message
console.log('Server running at http://127.0.0.1:8083/');
// var events = require('events');
// var eventEmitter = new events.EventEmitter();

// // listener #1
// var listner1 = function listner1() {
//    console.log('listner1 executed.');
// }

// // listener #2
// var listner2 = function listner2() {
//   console.log('listner2 executed.');
// }

// // Bind the connection event with the listner1 function
// eventEmitter.addListener('connection', listner1);

// // Bind the connection event with the listner2 function
// eventEmitter.on('connection', listner2);

// var eventListeners = require('events').EventEmitter.listenerCount
//    (eventEmitter,'connection');
// console.log(eventListeners + " Listner(s) listening to connection event");

// // Fire the connection event 
// eventEmitter.emit('connection');

// // Remove the binding of listner1 function
// eventEmitter.removeListener('connection', listner1);
// console.log("Listner1 will not listen now.");

// // Fire the connection event 
// eventEmitter.emit('connection');

// eventListeners = require('events').EventEmitter.listenerCount(eventEmitter,'connection');
// console.log(eventListeners + " Listner(s) listening to connection event");

// console.log("Program Ended.");
// console.log("--------------------------------------------------------------------------------");
// buf = new Buffer(256);
// len = buf.write("Simply Easy Learning");

// console.log("Octets written : "+  len);
// console.log("--------------------------------------------------------------------------------");

// buf = new Buffer(26);
// for (var i = 0 ; i < 26 ; i++) {
//   buf[i] = i + 97;
// }

// console.log( buf.toString('ascii'));       // outputs: abcdefghijklmnopqrstuvwxyz
// console.log( buf.toString('ascii',0,5));   // outputs: abcde
// console.log( buf.toString('utf8',0,5));    // outputs: abcde
// console.log( buf.toString(undefined,0,5)); // encoding defaults to 'utf8', outputs abcde
// console.log("--------------------------------------------------------------------------------");
// var buf = new Buffer('Simply Easy Learning');
// var json = buf.toJSON(buf);

// console.log(json);
// console.log("--------------------------------------------------------------------------------");
// var buffer1 = new Buffer('TutorialsPoint ');
// var buffer2 = new Buffer('Simply Easy Learning');
// var buffer3 = Buffer.concat([buffer1,buffer2]);
// console.log("buffer3 content: " + buffer3.toString());
// console.log("--------------------------------------------------------------------------------");
// var buffer1 = new Buffer('ABC');
// var buffer2 = new Buffer('ABCD');
// var result = buffer1.compare(buffer2);

// if(result < 0) {
//    console.log(buffer1 +" comes before " + buffer2);
// }else if(result == 0){
//    console.log(buffer1 +" is same as " + buffer2);
// }else {
//    console.log(buffer1 +" comes after " + buffer2);
// }
// console.log("--------------------------------------------------------------------------------");
// var fs = require("fs");
// var data = '';

// // Create a readable stream
// var readerStream = fs.createReadStream('input.txt');

// // Set the encoding to be utf8. 
// readerStream.setEncoding('UTF8');

// // Handle stream events --> data, end, and error
// readerStream.on('data', function(chunk) {
//    data += chunk;
// });

// readerStream.on('end',function(){
//    console.log(data);
// });

// readerStream.on('error', function(err){
//    console.log(err.stack);
// });

// console.log("Program Ended");
// console.log("--------------------------------------------------------------------------------");

// var fs = require("fs");
// var data = 'Simply Easy Learning';

// // Create a writable stream
// var writerStream = fs.createWriteStream('output.txt');

// // Write the data to stream with encoding to be utf8
// writerStream.write(data,'UTF8');

// // Mark the end of file
// writerStream.end();

// // Handle stream events --> finish, and error
// writerStream.on('finish', function() {
//     console.log("Write completed.");
// });

// writerStream.on('error', function(err){
//    console.log(err.stack);
// });

// console.log("Program Ended");