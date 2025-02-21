const express = require('express')
const { MongoClient } = require('mongodb')
const app = express()

const dbUrl = 'mongodb+srv://admin:Gxt6nZzaFzYPz6O7@cluster0.ymffy4f.mongodb.net/'
const dbName = 'ocean-jornada-back-end'

const client = new MongoClient(dbUrl)

async function main() {


  console.log('Conectando ao banco de dados...')
  await client.connect()
  console.log('Banco de dados conectado com sucesso!')


  app.get('/', function (req, res) {
    res.send('Hello World')
  })

  // Desafio: criar endpoint /oi que exibe "Olá, mundo!"
  app.get('/oi', function (req, res) {
    res.send('Olá, mundo!')
  })

  // Lista de Personagens
  const lista = ['Rick Sanchez', 'Morty Smith', 'Summer Smith']

  const db = client.db(dbName)
  const collection = db.collection('item')

  // Read All - [GET] /item
  app.get('/item', async function (req, res) {

    //Obter todos os documentos da collection
    const documentos = await collection.find().toArray()

    // Pegamos a lista e enviamos como resposta HTTP
    res.send(documentos)
  })

  // Sinalizamos para o Express que vamos usar JSON no Body
  app.use(express.json())

  // Create - [POST] /item
  app.post('/item', async function (req, res) {
    
    // Obtemos o nome enviado no Request Body
    const item = req.body

    //Inserimos o Item na Collection
    await collection.insertOne(item)
    
    // Enviamos uma mensagem de sucesso!
    res.send(item)
  })

  // Ready by ID - [GET] /item/:id
  app.get('/item/:id', function (req, res) {
    
    //Acessamos o parâmetro de rota ID
    const id = req.params.id

    // Acessamos o item na lista pelo índice corrigido (id - 1)
    const item = lista[id - 1]

    // Enviamos o item obtido como resposta
    res.send(item)
  })

  // Update - [PUT] /item/:id
  app.put('/item/:id', function (req, res) {
    
    // Acessamos o ID do parâmetro de rota
    const id = req.params.id

    //Acessamos novo item no Body da requisição
    const novoItem = req.body.nome

    //Atualizamos esse novoItem na lista, usando o índice
    lista[id - 1] = novoItem

    // Enviamos uma mensagem de sucesso
    res.send('Item atualizado com sucesso: ' + id)

  })

  app.listen(3000)
}

main()