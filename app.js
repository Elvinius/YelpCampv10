var express =    require("express"),
    app =        express(),
    bodyParser = require("body-parser"),
	  passport = require("passport"),
	  LocalStrategy = require("passport-local"),
		methodOverride = require("method-override"),
    mongoose =   require("mongoose"),
	  Campground = require("./models/campground"),
	  Comment = require("./models/comment"),
	  User = require("./models/user"),
  	seedDB = require("./seeds");
//requiring routes
var commentRoutes  = require("./routes/comments"),
		campgroundRoutes = require("./routes/campgrounds"),
		indexRoutes      = require("./routes/index");

mongoose.connect('mongodb://localhost:27017/yelp_camp_v10', { useNewUrlParser: true,
	useUnifiedTopology: true
	});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB();

//PASSPORT CONFIGURATION

app.use(require("express-session")({
	secret: "Children do not have chances but they have possibilities",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res, next){
		res.locals.currentUser = req.user;
	  next();
	});  //this code is to make sure that current user gets known in all the local routes

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(3001, function(){
	console.log("YelpCamp server has Started!");
});