//imports
const express = require("express");
const routes = express.Router();
const Joi = require('joi');
//use
routes.use(express.json());


//dictionary
const products = [{
        id: 1,
        name: 'product 1',
        price: 200
    },
    {
        id: 2,
        name: 'product 1',
        price: 200
    },
    {
        id: 3,
        name: 'product 1',
        price: 200
    }
];

//Routes


routes.get('/', (req, res) => {
    res.send(products)

});

//post

routes.post('/', (req, res) => {
    const result = validateInputs(req.body);
    const Sproduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price

    };
    console.log("pushing product", Sproduct);
    if (result.error){
        return res.status(400).send('invalidi data')
    }
    products.push(Sproduct);
    res.send(products)
});

//delete

routes.delete('/:id', (req, res) => {
    // if product doest not exists return 404
    console.log('_id', parseInt(req.params.id));
    const product = products.find(prod => prod.id === parseInt(req.params.id));

    if (!product) return res.status(404).send('Product not found.');
    console.log('product_', product);
    //splice to be deleted product
    const productIndex = products.findIndex(p => p.id == parseInt(req.params.id));
    console.log('index_', productIndex);
    products.splice(productIndex, 1);
    console.log('products at end ', products);
    res.send(products);
});

//update

routes.put('/:id', (req, res) => {
    //if this does exist
    console.log('id', parseInt(req.params.id));
    const product = products.find(prod => prod.id === parseInt(req.params.id));
    if (!product) return res.status(404).send('production fucking not found');

    const result = validateInputs(req.body);
    console.log('_result ', result);
    if (result.error != null) {
        // console.log('result_ error ', result.error);
        res.status(400).send(`invalid data ${JSON.stringify(req.body)}`);
        return;
    }
    //lets find its index
    const productIndexs = products.findIndex(prod => prod.id === parseInt(req.params.id));
    const updateProduct = {
        id: parseInt(req.params.id),
        name: req.body.name,
        price: req.body.price
    };
    products[productIndexs] = updateProduct;
    console.log(products);
    res.send(products);
});

//Validate
function validateInputs(data) {
    const schema = {
        name: Joi.string().min(3).max(15).required(),
        price: Joi.number().min(3).required()

    }
    return Joi.validate(data, schema);



};
module.exports=routes;