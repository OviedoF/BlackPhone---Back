const mongoose = require('mongoose');
require('dotenv').config();
mongoose.set('strictQuery', true);
const dbUri = process.env.DB_URI;
// const dbUri = 'mongodb+srv://admin:1xC5JpgpnlEC1lQu@cluster0.cuaouuj.mongodb.net/?retryWrites=true&w=majoritymongodb+srv://admin:1xC5JpgpnlEC1lQu@cluster0.cuaouuj.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(res => console.log(`[DATABASE] ✨✨ DB is connected succesfully!`))
    .catch(err => console.log(err));

module.exports = mongoose;