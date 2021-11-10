const mongoose = require('mongoose')

const uri =
  'mongodb+srv://test:Vova1234Test@cluster0.aqfia.mongodb.net/taskdb?retryWrites=true&w=majority'
mongoose.Promise = global.Promise
mongoose
  .connect(uri, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connect to MongoDB successfully')
  })
  .catch((e) => {
    console.log('Error: ', e)
  })

module.exports = { mongoose }
