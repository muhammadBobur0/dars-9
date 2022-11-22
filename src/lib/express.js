const url = require('url');
const querystring = require('querystring');

class Express {
  constructor(req, res) {
    this.req = req;
    this.res = res;

    if (this.req.method != 'GET') {
      this.req.body = new Promise((resolve, reject) => {
        let str = '';
        try {
          req.on('data', (chunk) => (str += chunk));
        req.on('end', () => {
          resolve(JSON.parse(str));
        });
        } catch (error) {
          resolve(str)
        }

      })       
    }

    this.res.json = (data) => {
      this.res.writeHead(200, {'Content-Type': 'application/json'})
      return this.res.end(JSON.stringify(data))
    }

    this.res.setHeader('Access-Control-Allow-Origin', '*');
    this.res.setHeader('Access-Control-Allow-Credentials', 'true');
    this.res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization',
      );
      this.res.setHeader('Access-Control-Expose-Headers', 'Content-Length');
  }

  get(route, callback) {
    let { pathname, query } = url.parse(this.req.url);
    this.req.query = querystring.parse(query);
    if (pathname == route && this.req.method == 'GET') {
      callback(this.req, this.res);
    }
  }

  post(route, callback) {
    if (this.req.url == route && this.req.method == 'POST') {
      callback(this.req, this.res);
    }
  }

  delete(route, callback) {
    if (this.req.url == route && this.req.method == 'DELETE') {
      callback(this.req, this.res);
    }
  }
  put(route, callback) {
    if (this.req.url == route && this.req.method == 'PUT') {
      callback(this.req, this.res);
    }
  }
}

module.exports = Express;
