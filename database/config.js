const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN);
        console.info('db online')
    }
    catch(error){
        throw new Error('db cannot initialize:',error)
    }
}

module.exports = {
    dbConnection
}