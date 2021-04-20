# Budgeter

- **Author:** Carson Fuhs
- **Link to Live Site:** https://budgeterproject2.herokuapp.com/


## A simple way to budget.

This site lets you add incomes, expenses, and totals it up. Each income and expense is saved under your username, and requires authentication to use.


## Technology Used
 - nodeJS
 - ejs
 - HTML, CSS
 - Bulma CSS Framework
 - Express
 - Mongoose
 - Heroku to host
 - MongoDB


## Models


IncomeSchema
 - incomeDescription: String
 - incomeAmount: Number

ExpenseSchema
 - expenseDescription: String
 - expenseAmount: Number

UserSchema
    
 - username
    - type: String
    - unique: true
    - required: true

 - password:
    - type: String
    - required: true

 - incomes: [IncomeSchema]
 - expenses: [ExpenseSchema]




## Route Map

| Method | Endpoint | Resource/View |
|--------|----------|---------------|
|GET| "/budget" | List your budget (budget.ejs) |
|GET| "/budget/income/new | Render form for new income (newIncome.ejs)|
|GET| "/budget/expense/new | Render form for new expense (newExpense.ejs)|
|POST| "/budget/income/new" | Uses Form Submission to Create new entry for income |
|POST| "/budget/expense/new" | Uses Form Submission to Create new entry for expense |
|GET| "/budget/income/:id/edit" | Render form to edit income (editIncome.ejs)|
|PUT| "/budget/income/:id" | Uses Form Submission to edit income |
|GET| "/budget/expense/:id/edit" | Render form to edit expense (editExpense.ejs)|
|PUT| "/budget/expense/:id" | Uses Form Submission to edit expense |
|DELETE| "/budget/income/:id" | Delete a particular income |
|DELETE| "/budget/expense/:id" | Delete a particular expense |


## Challenges

Writing the edit and delete functions were difficult as I structured my data in a weird way and wasn't sure how to edit arrays out of a particular object in Mongo. But it was a good experience as I eventually figured it out. Lesson learned is to really consider your data structure when building a project like this as it can really change things down the road.


## Existing Bugs

Mostly error handling. If you put a description in amount, it'll freeze up as Mongo will only take numbers for that field. In the future, I'd like to have that handled by the page. If you use an incorrect login, it will just redirect you back to the login page - ideally it would handle the error correctly and notify you that you used a bad login.