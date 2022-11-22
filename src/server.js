const http = require('http');
const Express = require('./lib/express');
const { read, write } = require('./utils/model');
const PORT = process.env.PORT || 5000;
const cors = require('cors');

function httpServer(req, res) {
	const app = new Express(req, res);
	
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization',
		);
		res.setHeader('Access-Control-Expose-Headers', 'Content-Length');
		
		app.get('/todos', (req, res) => {
			let { completed } = req.query;
			let todos = read('todos');
			let data = todos.filter((todo) => todo.completed.toString() == completed);
			if (data.length) {
				return res.json(data);
			}
			res.json(todos);
		});
		
		app.post('/todos', async (req, res) => {
			let { title } = await req.body;
			let data = read('todos');
			let newtodo = {
				todoId: data.at(-1).todoId + 1 || 1,
				title: title,
				completed: false,
				userId: 2,
			};
			data.push(newtodo);
			write('todos', data);
			res.writeHead(201, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ status: 201, message: 'you are news created' }));
		});
		
		app.delete('/todos', async (req, res) => {
			let { todoId } = await req.body;
			let data = read('todos');
			try {
				let newtodo = data.findIndex((e) => e.todoId == todoId);
				let newNews = data.splice(newtodo, 1);
				write('todos', data);
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(
					JSON.stringify({
						status: 200,
						message: 'you are news delete',
						data: newNews,
					}),
					);
				} catch (error) {
					res.writeHead(400, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ status: 400, message: error.message }));
				}
			});
			
			app.put('/todos', async (req, res) => {
				let { todoId, title, completed } = await req.body;
				let data = read('todos');
				let newtodo = data.find((e) => e.todoId == todoId);
				title ? (newtodo.title = title) : (newtodo.title = newtodo.title);
				completed ? (newtodo.completed = completed) : (newtodo.completed = false);
				write('todos', data);
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(
					JSON.stringify({
						status: 200,
						message: 'you are news add',
						data: newtodo,
					}),
					);
				});
			}
			
			const server = http.createServer(httpServer);
			
			server.listen(PORT, () => console.log('server'));
			