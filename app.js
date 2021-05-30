const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')
require('dotenv').config()

mongoose.connect(`mongodb://localhost:27017/userDB`, {useNewUrlParser: true, useUnifiedTopology: true})

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const secret = process.env.SECRET_ENCRYPTION_STRING
console.log(secret);
userSchema.plugin(encrypt,{secret: secret, encryptedFields:["password"]})

const User = mongoose.model('User', userSchema)

const app = express()
app.use(express.urlencoded())

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res)=>{
  res.render('home')
})
app.get('/login', (req, res)=>{
  res.render('login')
})
app.post('/login', (req, res)=>{
  const username = req.body.username
  const password = req.body.password
  User.findOne({email: username}, (err, foundUser)=>{
    if(err){
      console.log(err);
    } else{
      if(foundUser){
        if(password===foundUser.password){
          res.render('secrets')
        }
      }
    }
  })
})
app.get('/register', (req, res)=>{
  res.render('register')
})
app.post('/register', (req, res)=>{
  const user = new User({email: req.body.username, password: req.body.password})
  user.save((err)=>{
    if(!err){
      res.render('secrets')
    } else{
      console.log(err);
    }
  })
})

app.listen(3000, ()=>{console.log("Connected to port 3000")})
