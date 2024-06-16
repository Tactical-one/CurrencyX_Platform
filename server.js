const express = require('express')
const path = require('path')
const app = express() 
const bodyParser = require('body-parser')
const port = 8080

app.locals.titles = "CURRENCYX"

// middleware helper functions within express
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.redirect('/home')
})

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})


let transactions = []  //array to store transactions

app.post('/form-submit', (req, res) => {
    //Take what was sent from the req.body and send into the route
    const {send_amount, send_currency, result, receive_currency} = req.body
    const newTransaction = {id: transactions.length + 1, send_amount, send_currency, result, receive_currency}
    transactions.push(newTransaction) // adds new transaction to the array
    })   

   // Endpoint to get all transactions in descending order 
app.get('/transactions', (req, res) => {
    const sortedTransactions = [...transactions].sort((a, b) => b.id - a.id);
    res.json(sortedTransactions) // returns the transaction array
})


