'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const compression = require('compression');
const passport = require('passport');

const config = require('./config/config');
const usersRoutes = require('./api/routes/users');
const profileRoutes = require('./api/routes/profile');
const postsRoutes = require('./api/routes/posts');

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', usersRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postsRoutes);

// Check if all environment variables are set
config.checkEnvVariables();

mongoose
	.connect(config.dbUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(() => {
		const server = app.listen(config.port, () => {
			console.log('Your app is listening on port ' + server.address().port);
		});
	})
	.catch((err) => console.log(err));
