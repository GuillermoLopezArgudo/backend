require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
app.use(express.static('dist'))
app.use(cors())

morgan.token('body', (request, res) => JSON.stringify(request.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.json())

let boolean = false
let datos = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)   
    })
  
})

app.get('/info', (request, response) => {

    if(!boolean) {
        response.send(`<p>Phonebook has info for ${datos.length} people</p> <p>${Date()}</p>`)
        boolean = true
    }
     
})

app.get('/api/persons/:id', (request, response) => {

    const id= Number(request.params.id)
    const dato = datos.find(dato => dato.id === id)

    if (dato) {
        response.json(dato)
    } else {
        response.status(404).end()
    }
    

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    datos = datos.filter(dato => dato.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const random = Math.floor(Math.random() * (100 - datos.length) + datos.length)
    return random
}

app.post('/api/persons', (request, response) => {


    const body = request.body

    if(datos.some(dato => dato.name === body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const dato = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    datos = datos.concat(dato)
    response.json(dato)
    
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    if(body.name === undefined) {
        return response.status(400).json({ error: 'name missing'})
    } else  if(body.name === undefined){
        return response.status(400).json({ error: 'number missing'}) 
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
