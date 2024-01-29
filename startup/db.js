const mongoose = require('mongoose');



module.exports = function() {
    const db = process.env.MONGODB_URI
    mongoose.connect(db)
      .then(() => console.log(`Database Conected!!!`));

  }