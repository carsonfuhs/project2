///////////////////////////////
// Import Router
////////////////////////////////
const router = require("express").Router()
const bcrypt = require("bcryptjs")
const { isValidObjectId } = require("mongoose")
const User = require('../models/user')

///////////////////////////////
// Custom Middleware Functions
////////////////////////////////

//check if user is logged in, add user to request
const addUserToRequest = async(req, res, next) => {

    //check if the user is logged in
    if (req.session.userId) {
        req.user = await User.findById(req.session.userId)
        next()
    } else {
        next()
    }
}

//checks if req.user exists. if not, redirect to login
const isAuthorized = (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.redirect('auth/login')
    }
}

///////////////////////////////
// Router Specific Middleware
////////////////////////////////
router.use(addUserToRequest)


///////////////////////////////
// Router Routes
////////////////////////////////
router.get("/", (req, res) => {
    res.render("home")
})

//auth related routes

//signup route
router.get('/auth/signup', (req, res) => {
    res.render('auth/signup.ejs')
})

router.post('/auth/signup', async (req, res) => {
    try {
        //generate salt
        const salt = await bcrypt.genSalt(10)

        //hash the password
        req.body.password = await bcrypt.hash(req.body.password, salt)

        //testing purposes
        console.log(req.body)

        //create the new user
        await User.create(req.body)

        //redirect the user
        res.redirect('/auth/login')

    } catch(error) {
        res.json(error)
    }
})

//login routes
router.get('/auth/login', (req, res) => {
    res.render('auth/login')
})

router.post('/auth/login', async (req, res) => {
    try {

        //get the user
        const user = await User.findOne({username: req.body.username})
        let userDoesntExistError = false
        let passwordDoesntMatchError = false

        //check if user exists
        if (user) {

            //check if the passwords match
            const result = await bcrypt.compare(req.body.password, user.password)

            //check if password matches
            if (result) {
                //add userId property to session object
                req.session.userId = user._id

                //redirect 
                res.redirect('/budget')

            } else {
                //res.json({error: "Password does not match"})
                res.render('auth/login')
            }
        } else {
            //res.json({error: "User Doesn't Exist"})
            res.render('auth/login')
        }
    } catch(error) {
        res.json(error)
    }
})

//logout
router.get('/auth/logout', (req, res) => {

    //remore the userId property
    req.session.userId = null

    //redirect to the main page
    res.redirect('/')
})

router.get('/budget', isAuthorized, async (req, res) => {
    
    //pass req.user to our template
    res.render('budget', {
        incomes: req.user.incomes,
        expenses: req.user.expenses,
    })

})

//creating a new income
router.get('/budget/income/new', isAuthorized, (req, res) => {
    res.render('newIncome.ejs', {
        income: req.user.incomes
    })
})
//posting a new income
router.post('/budget/income/new', isAuthorized, async (req, res) => {

    //fetch up to date user
    const user = await User.findOne({username: req.user.username})

    //push the expense into the user
    user.incomes.push(req.body)
    await user.save()

    //redirect back to budget
    res.redirect('/budget')
    
})

//creating a new expense
router.get('/budget/expense/new', isAuthorized, (req, res) => {
    res.render('newExpense.ejs', {
        expense: req.user.expenses
    })
})
//posting a new expense
router.post('/budget/expense/new', isAuthorized, async (req, res) => {

    //fetch up to date user
    const user = await User.findOne({username: req.user.username})

    //push the expense into the user
    user.expenses.push(req.body)
    await user.save()

    //redirect back to budget
    res.redirect('/budget')
    
})

//editing an income entry
router.get('/budget/income/:id/edit', isAuthorized, (req,res) => {

    User.findById(req.params.id, (error, incomeID) => {

        const index1 = req.user.incomes.findIndex(x => x.id === req.params.id)

        res.render('editIncome.ejs', {
            id: req.params.id,
            amount: req.user.incomes[index1].incomeAmount,
            description: req.user.incomes[index1].incomeDescription,
            //expenses: req.user.expenses,
        })
    })
})
//posting the edited income entry
router.put('/budget/income/:id', isAuthorized, async (req, res) => {

    //fetch up to date user
    const user = await User.findOne({username: req.user.username})

    //finds the array index in mongo
    const index1 = req.user.incomes.findIndex(x => x.id === req.params.id)

    //deletes the current array and pushes the new data into its spot
    user.incomes.splice(index1, 1)
    user.incomes.splice((index1), 0, req.body)
    await user.save()

    //redirect back to budget
    res.redirect('/budget')

})

//editing an expense entry
router.get('/budget/expense/:id/edit', isAuthorized, (req,res) => {

    User.findById(req.params.id, (error, incomeID) => {

        const index1 = req.user.expenses.findIndex(x => x.id === req.params.id)

        res.render('editExpense.ejs', {
            id: req.params.id,
            amount: req.user.expenses[index1].expenseAmount,
            description: req.user.expenses[index1].expenseDescription,
            //expenses: req.user.expenses,
        })
    })
})
//posting the edited expense entry
router.put('/budget/expense/:id', isAuthorized, async (req, res) => {

    //fetch up to date user
    const user = await User.findOne({username: req.user.username})

    //finds the array index in mongo
    const index1 = req.user.expenses.findIndex(x => x.id === req.params.id)

    //deletes the current array and pushes the new data into its spot
    user.expenses.splice(index1, 1)
    user.expenses.splice((index1), 0, req.body)
    await user.save()

    //redirect back to budget
    res.redirect('/budget')

})

//deleting an income entry
router.delete('/budget/income/:id', isAuthorized, async (req, res) => {

    //fetch up to date user
    const user = await User.findOne({username: req.user.username})

    //finds the array index in mongo
    const index1 = req.user.incomes.findIndex(x => x.id === req.params.id)

    //deletes the current array
    user.incomes.splice(index1, 1)
    await user.save()

    //redirect back to budget
    res.redirect('/budget')

})

//deleting an expense entry
router.delete('/budget/expense/:id', isAuthorized, async (req, res) => {

    //fetch up to date user
    const user = await User.findOne({username: req.user.username})

    //finds the array index in mongo
    const index1 = req.user.expenses.findIndex(x => x.id === req.params.id)

    //deletes the current array
    user.expenses.splice(index1, 1)
    await user.save()

    //redirect back to budget
    res.redirect('/budget')

})


///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router