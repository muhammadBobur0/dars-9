const http = require('http')
const Express = require('./lib/express')
const { read , write} = require('./utils/model')
const PORT = process.env.PORT || 5000



function httpServer (req, res) {
  const app = new Express(req, res)
  app.get('/todos', (req, res) => {
    let users = read('todos')
    res.json(users)
  })

  app.get('/todos', (req, res) => {
    let { completed } = req.query
    if(req.query){
      let todos = read('todos');
      let data = todos.filter(todo => todo.completed.toString() == completed)
      if(data.length){
        return res.json(data);
      }
      res.json(todos)
    }
    
  });
  
  
  app.post('/todos', async (req, res)=>{
    let {title} = await req.body
    let data = read('todos')
    let newtodo = {todoId: data.at(-1).todoId +1 || 1, title:title, completed: false, userId: 2}
    data.push(newtodo)
    write('todos', data)
    res.writeHead(201, {'Content-Type' : 'application/json'})
    res.end(JSON.stringify({status:201, message:'you are news created'}))
  })
  app.delete('/todos', async (req, res)=>{
    let {id} = await req.body
    let data = read('todos')
    let newtodo = data.findIndex((e)=> e.todoId == id)
    let newNews  =  data.splice(newtodo, 1)
    write('todos', data)
    res.writeHead(200, {'Content-Type' : 'application/json'})
    res.end(JSON.stringify({status:200, message:'you are news delete', data : newNews}))
  })
  app.put('/todos', async (req, res)=>{
    let {id, title, completed} = await req.body
    let data = read('todos')
    let newtodo = data.find((e)=> e.todoId == id)
    title? newtodo.title = title : ''
    completed ? newtodo.completed = true : false
    write('todos', data)
    res.writeHead(200, {'Content-Type' : 'application/json'})
    res.end(JSON.stringify({status:200, message:'you are news add', data : newNews}))
  })
}

const server = http.createServer(httpServer)

server.listen(PORT, () => console.log('server ready at'));