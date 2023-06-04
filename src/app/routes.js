module.exports = (app, passport) => {
	app.get('', (req, res) => {
		res.render('index');
	});

	app.get('/login', (req, res) => {
		res.render('login', {
			message: req.flash('loginMessage')
		});
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.get('/signup', (req, res) => {
		res.render('signup', {
			message: req.flash('signupMessage')
		});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	app.get('/profile', isLoggedIn, (req, res) => {
		res.render('profile', {
			user: req.user
			
		});
	});

	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

	app.post('/upload',function(req,res){
		if(req.files.upfile){
			var file = req.files.upfile,
			name     = file.name,
			type     = file.mimetype,
			length   = file.data.toString().length,
			maxlength = 5242880; // 5 mb

			if(length > maxlength){
				res.send("Tamaño máximo de archivo excedido");
			}else{
				if(type.match(/image\/*/i)){
					var uploadpath = __dirname + '/ /' + name;
					file.mv(uploadpath,function(err){
						if(err){
							console.log("Subida de archivo fallida",name,err);
							res.send("Un error ha ocurrido!")
						}else {
							res.send('Subido con exito!')
						}
					});
				}else {
					res.send("Formato no soportado");
				}
			}
		}else{
			res.send("Ningun archivo elegido!");
			res.end();
		}
	});
};

//revisando que la sesion esta activa
function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}