var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var url = require('url') ;
const faker = require('faker')

var fs = require('fs');
var UPLOAD_DIR =  path.join(__dirname, '/uploads');
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});
function* range(start, stop, step = 1) {
   if (stop === undefined) [start, stop] = [0, start];
   if (step > 0) while (start < stop) yield start, start += step;
   else if (step < 0) while (start > stop) yield start, start += step;
   else throw new RangeError('range() step argument invalid');
} 
function getTags()
 {
   var tags = []; 
   
   for (i = 0; i < 4; i++) { 
     tags.push(faker.lorem.word());
    }
     return tags;
 }
app.get('/getallfiles', function(req, res){
  fs.readdir(UPLOAD_DIR, function(err, items) {
  var hostname = req.headers.host;
  var files = [];
  for(var index in items)
    {
      
      tmp = new Object()
      tmp.url = 'http://' + hostname +'/' + items[index];
      tmp.filename = items[index];
      tmp.name = faker.findName;
      tmp.author =  faker.name.findName();
      tmp.location = faker.address.city() + ',' + faker.address.state()
      // tmp.tags = getTags();
      tmp.uniqueId = index;
      files.push(tmp);
  }
  res.json(files);
  // console.log(files)
  }); 
});
app.post('/upload', function(req, res){
  // create an incoming form object
  var form = new formidable.IncomingForm();
  // console.log(form);
  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;
  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');
  // console.log(__dirname);
  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });
  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });
  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });
  // parse the incoming request containing the form data
  form.parse(req);
});
app.use(express.static('uploads'))


var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
 
});
