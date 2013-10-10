var express = require("express");
var OpenTokLibrary = require('opentok');

var urlSessions = {};
var apikey = '43672442';
var secretkey = '2d109ea79c71e50d427fa39c3cea3b36ad1c33db';
var OpenTokObject = new OpenTokLibrary.OpenTokSDK(apikey, secretkey);

var app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

function sendResponse( sessionId, responder ){
  var token = OpenTokObject.generateToken({session_id: sessionId});
  var data = {OpenTokKey:apikey, sessionId: sessionId, token:token};
  responder.render('index', data);
}

app.get('/', function(request, response) {
  response.send('Hello World!');
});
app.get("/chat/:root", function(req, res){
  if (urlSessions[req.params.room] == undefined) {
    OpenTokObject.createSession(function(sessionId){
      urlSessions[req.params.room] = sessionId;
      sendResponse(sessionId, res);
    });
  } else {
    sessionId = urlSessions[req.params.room];
    sendResponse(sessionId, res);
  }
});