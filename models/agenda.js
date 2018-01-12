const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AgendaSchema = new Schema({
	debut:{
		type:Date,
		require:true,
		timestamps: true,
	},
	fin:{
		type:Date,
		require:true,
		timestamps: true,
	},
	description:{
		type:String,
		require:true,
	},
	patient:{
		type: Schema.Types.ObjectId,
		ref: 'User',
	}
});
const Agenda = mongoose.model('Agenda', AgendaSchema);

module.exports = Agenda;
