
const fetch = require('node-fetch'); // NOTE: If node-fetch is not available, I might need to use https or axios if installed. 
// checking package.json: server has 'express', 'mongoose', etc. client has 'axios'.
// server doesn't seem to have axios or node-fetch in dependencies list I saw earlier (only .start, .test etc in scripts, dependencies: supabase-js, bcryptjs, cors, dotenv, express, jsonwebtoken, mongoose, react-paystack).
// user environment might not have node-fetch. 
// I will use native 'http' module to be safe or 'axios' if I can run it from client folder?
// let's try running it from client folder using axios since client has axios.

const axios = require('axios');

async function testOrder() {
    const API_URL = 'http://localhost:5000/api';

    try {
        // 1. Get a product
        console.log('Fetching products...');
        const productsRes = await axios.get(`${API_URL}/products?limit=1`);
        const products = productsRes.data.products || productsRes.data;

        if (!products || products.length === 0) {
            console.error('No products found');
            return;
        }

        const product = products[0];
        console.log('Found product:', product._id, product.product_name);

        // 2. Create Order
        const orderData = {
            customer: {
                email: 'test@example.com',
                phone: '08012345678'
            },
            shipping: {
                full_name: 'Test User',
                address: '123 Test St',
                city: 'Lagos',
                state: 'Lagos',
                postal_code: '100001',
                country: 'Nigeria'
            },
            items: [
                {
                    product_id: product._id,
                    product_name: product.product_name,
                    price: product.price,
                    quantity: 1
                }
            ],
            payment: {
                method: 'cash_on_delivery',
                status: 'pending'
            },
            shipping_fee: 1000,
            tax: 0,
            delivery_notes: 'Test order via script'
        };

        console.log('Creating order...');
        const orderRes = await axios.post(`${API_URL}/orders`, orderData);

        console.log('Order creation result:', JSON.stringify(orderRes.data, null, 2));

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testOrder();
