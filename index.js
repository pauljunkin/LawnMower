var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var dataUtil = require("./data-util");
var _ = require("underscore");
var logger = require('morgan');
var exphbs = require('express-handlebars');
var handlebars = exphbs.handlebars;
var moment = require('moment');
var marked = require('marked');
var app = express();
var PORT = 3000;

var _DATA = dataUtil.loadData().calendar;

/// MIDDLEWARE 
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main', partialsDir: "views/partials/" }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

app.get("/", function(req, res) {
    //var tags = dataUtil.getAllTags(_DATA);
    res.render('homePage');
});
app.get("/contact", function(req, res) {
    res.render('contact');
});
app.get("/pricing", function(req, res) {
    res.render('pricing');
});
app.get("/appointment", function(req, res) {
    res.render('appointment');
    
});
app.get("/appointment/:date", function(req, res) {
    var str = req.params.date;
    var date = str.match(/^[0-9]{2}-[0-9]{2}-[0-9]{4}$/g);
    if(!date){
        return res.render('404')
    }
    for(let i = 0; i < _.size(_DATA); i++){
        if(_DATA[i].date == date){
            var temp1 = _DATA[i].times
            var temp = _DATA[i].date 
        }
    }
    if(!temp1){
        var newDate = {"date" : `${date}`, "times" : { "8am" : false, "9am" : false, "10am" : false, "11am" : false, "12pm" : false, "1pm" : false, "2pm" : false, "3pm" : false, "4pm" : false, "5pm" : false }}
        temp1 = newDate.times
        temp = newDate.date
    }
    res.render('appointment', {
        times: temp1,
        date: temp
    });
    
});
app.get("/create/:date", function(req, res) {
    var _date = req.params.date;
    var _time = req.query.time;
    res.render('create', {
        date: _date,
        time: _time
    });
});

app.post('/create/:date', function(req, res) {
    var _date = req.params.date;
    var time = req.query.time;
    var day;
    var update;
    var body = req.body;
    for(let i = 0; i < _.size(_DATA); i++){
        if(_DATA[i].date == _date){
           day = _DATA[i].info;
           update = _DATA[i].times;
        }
    }
    day[time] = body
    update[time] = true;
    dataUtil.saveData(_DATA);
    res.redirect("/");
    /*
    // Transform tags and content 
    body.tags = body.tags.split(" ");
    body.content = marked(body.content);

    // Add time and preview
    body.preview = body.content.substring(0, 300);
    body.time = moment().format('MMMM Do YYYY, h:mm a');

    // Save new blog post
    _DATA.push(req.body);
    dataUtil.saveData(_DATA);
    res.redirect("/");*/
});

app.get('/post/:slug', function(req, res) {
    var _slug = req.params.slug;
    var blog_post = _.findWhere(_DATA, { slug: _slug });
    if (!blog_post) return res.render('404');
    res.render('post', blog_post);
});

app.get('/tag/:tag', function(req, res) {
    var tags = dataUtil.getAllTags(_DATA);
    var tag = req.params.tag;
    var posts = [];
    _DATA.forEach(function(post) {
        if (post.tags.includes(tag)) {
            posts.push(post);
        }
    });
    res.render('home', {
        tag: tag,
        data: posts,
        tags: tags
    });
});

// Start listening on port PORT
app.listen(PORT, function() {
    console.log('Server listening on port:', PORT);
});
