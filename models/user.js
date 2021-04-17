//import schema and model
const {Schema, model} = require('../db/connection')

//image schema
const IncomeSchema = new Schema({
    incomeDescription: String,
    incomeAmount: Number,
})

const ExpenseSchema = new Schema({
    expenseDescription: String,
    expenseAmount: Number,
})

//user schema
const UserSchema = new Schema({
    
    username: {
        type: String,
        unique: true,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    incomes: [IncomeSchema],

    expenses: [ExpenseSchema],

}, {timestamps: true} )

//user model
const User = model('User', UserSchema)

//exporting the user model
module.exports = User