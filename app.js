const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi= require('joi');
const logger = require('./logger');
const app = express();
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.use(logger);

const port = 3000;


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
]
console.log(port);

app.get('/', (req, res) => {
    res.send("hello world");
});


app.get('/api/products', (req, res) => {
    res.send(products)

});

app.post('/api/products', (req, res) => {
    const Sproduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price

    };
    console.log("pushing product", Sproduct);
    products.push(Sproduct);
    res.send(products)
})

app.delete('/api/products/:id', (req, res) => {
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
app.put('/api/products/update/:id',(req,res)=>{
    //if this does exist
    console.log('id',parseInt(req.params.id));
    const product= products.find(prod => prod.id === parseInt(req.params.id));
    if (!product) return res.status(404).send('production fucking not found');

    const result = validateInputs(req.body);
    console.log('_result ', result);
    if (result.error != null) { 
        // console.log('result_ error ', result.error);
        res.status(400).send(`invalid data ${JSON.stringify(req.body)}`);
        return;
    }
    //lets find its index
    const productIndexs= products.findIndex(prod => prod.id === parseInt(req.params.id));
    const updateProduct= {
        id: parseInt(req.params.id),
        name: req.body.name,
        price : req.body.price
    };
    products[productIndexs]=updateProduct;
    console.log(products);
    res.send(products);
} )

function validateInputs(data){
   const schema = {
        name : Joi.string().min(3).max(15).required(),
        price : Joi.number().min(3).required()

    }
    return Joi.validate(data, schema);



}





//This is listen. It should be at the bottom
app.listen(port, () => {
    console.log(`listening on ${port}`)
});