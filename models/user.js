const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname:{
    type: String,
    require: true
  },
  lastname:{
    type: String,
    require: true
  },
  username:{
    type: String,
    require:true,
    unique: true,
    index: true
  },
  password:{
    type: String,
    require: true
  },
  tel:{
    type:String,
    require:true,
  },
  specilaite:{
    type:String,
    require:true,
    default: 'rien'
  },
  adresse:{
    type:String,
    require:true,
  },
  role:{
    type:String,
    require:true,
    enum: ['patient', 'admin'],
    default: 'patient'
  },
  agendas: [{ type: Schema.Types.ObjectId, ref: 'Agenda' }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
