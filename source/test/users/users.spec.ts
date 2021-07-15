import  Request  from 'supertest';
import {expect} from 'chai'
import {internet} from "faker"
import Server from '../../server'
import Users from "../../models/users"

afterEach(() => {
    Users.deleteMany({username:randomUsername}).exec()
})
let randomUsername,
    randomPassword,
    presentUsername,
    presentPassword,
    token

describe("Users Test", ()=>{
    
    before(()=>{
        randomUsername=internet.userName();
        randomPassword = internet.password();
    })

    it("Login - POST/auth", async() =>{
        const res = await Request(Server).post("/auth")
        .send({username:"Butch",password:"1234"})
        token=res.body.token
         expect(res.status).to.equal(200)  
    })

})
