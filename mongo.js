const pasw = "6g1Wxp1GZDmsaEpo"

const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('give a password asrgument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://guillermolopezargudo:${password}@cluster0.hm0ss21.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3) {
 
    Person.find({}).then(persons => {
        persons.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })

} else {

    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)

        mongoose.connection.close()
    })
}