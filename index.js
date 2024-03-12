const mongoose = require('mongoose')
const cors = require('cors')
// cors package is used to connect different origin requests
const express = require('express')
const {Expense}=require('./schema.js')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(cors())

async function connectToDb(){
    try{
        await mongoose.connect('mongodb+srv://dprakash22:Dprakash2004@cluster.uz0duh9.mongodb.net/ExpenseTracker?retryWrites=true&w=majority&appName=Cluster')
        console.log("DB connection established")
        const port = process.env.PORT || 8000
        app.listen(port,function(){
        console.log(`Listening on port ${port}...`)
    })
    }catch(error){
        console.log(error,"connection not established")
    }
}
connectToDb()


//-----------ADD-------use POST

app.post('/add-expense',async function(req,res){
    try{
        Expense.create({
            "amount":req.body.amount,
            "category":req.body.category,
            "date":req.body.date
        })
        res.status(201).json({
            "status":"success",
            "message":"Entry created"
        })
        console.log("created")
    }catch(error){
        res.status(500).json({
            "status":"failure",
            "message":"Entry not created",
            "error":error
        })
        console.log("Not created")
    }
    
})

//-----------display-------use POST

app.get('/get-expense',async function(req,res){
    try{
        const data=await Expense.find()
        res.status(200).json(data)
    }
    catch(error){
        res.status(500).json({
            "status":"failure",
            "message":"could not fetch data",
            "error":error
        })

    }
})



//-----------delete-------use DELETE

app.delete('/delete-expense/:id',async function(req,res){
    try{
        const expenseEntry = await Expense.findById(req.params.id)
        if(expenseEntry){
            await Expense.findByIdAndDelete(req.params.id)
            res.status(200).json({
                "status":"Success",
                "message":"data deleted"
        })
    }
    }
    catch(error){
        res.status(500).json({
            "status":"failure",
            "message":"could not delete data",
            "error":error
        })

}    })


//-----------Update-------use Patch in postman

app.patch('/update-expense/:id',async function(req,res){
    try{
        const expenseEntry = await Expense.findById(req.params.id)
        if(expenseEntry){
            await expenseEntry.updateOne({
                "amount":req.body.amount,
                "category":req.body.category,
                "date":req.body.date

            })
            res.status(200).json({
                "status":"Success",
                "message":"data updated"
        })
    }
    }
    catch(error){
        res.status(500).json({
            "status":"failure",
            "message":"could not update data",
            "error":error
        })

}})
