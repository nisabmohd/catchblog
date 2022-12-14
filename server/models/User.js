const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        require: true,
        unique: true
    },
    img: {
        type: String
    },
    username: {
        type: String,
        require: true
    },
    joined: {
        type: Date,
        default: Date.now()
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    password: {
        type: String
    },
    email:{
        type:String,
        unique:true,
        require:true
    },
    savedlist:{
        type:Array,
        default:[]
    },
    notifications:{
        type:Array,
        default:[]
    },
    hasNotification:{
        type:Boolean,
        default:false
    },
    summary:{
        type:String,
        default:"-"
    }
})

const UserModel = new mongoose.model('user', userSchema)
module.exports = { UserModel }