import axios from 'axios';
import app from './server';
const baseurl = 'http://localhost:3001/api/';
let server;
const port = process.env.API_PORT || 3001;

beforeEach(() => {
  server = app.listen(port);
});

afterEach((done) => {
  server.close();
  done();
});

test('GET /api', (done) => {
  axios.get(baseurl).then(res => {
    expect(res.data.message).toBe('API Initialized!');
    done();
  }).catch(err => console.error(err));
});

test('GET /api/authors', (done) => {
  axios.get(baseurl + 'authors').then(res => {
    expect(res.data).toBeDefined();
    // mock more detailed response?
    done();
  }).catch(err => console.error(err));
});
