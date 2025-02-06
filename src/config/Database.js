const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://bhawnagupta4545:G3qa3tHP5Ji11VOt@cluster0.lcplg.mongodb.net/devTinder"
  );
};

module.exports = connectDb;
