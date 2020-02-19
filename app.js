const express = require('express');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
// const Joi = require('joi');
const productRoutes = require("./routes/products")
const logger = require('./logger');
const homeRoutes = require('./routes/home')
const app = express();

//app usage
app.use("/api/products", productRoutes)
app.use('/', homeRoutes)
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(logger);

//setting template engine
app.set("view engine", "pug");
app.set('views', './views');
//enviornment check

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log("morgan enabled");
}
console.log(config.get('name'));
const port = 3000;
console.log(port);

//This is listen. It should be at the bottom
app.listen(port, () => {
    console.log(`listening on ${port}`)
});