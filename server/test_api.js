const axios = require('axios');

async function test() {
    try {
        const res = await axios.get('http://localhost:5000/api/houses');
        console.log('Response from API:', res.data);
    } catch (err) {
        console.error('Error hitting API:', err.message);
    }
}

test();
