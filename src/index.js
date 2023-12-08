const app = require('./app');
require('dotenv').config();

// INIT
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`[SERVER] 🚀🚀 Server running on port: ${port}`);
}); 