import Server from '../source/server'
import SuperTest from 'supertest'

//close the server after test
afterEach((done)=>{
    Server.close();
    done()
})

describe('routes/products', () =>{
    it("pass", async () =>{
        const res = await SuperTest(Server).get('/get');
        expect(res.status).toEqual(200)
    })
})