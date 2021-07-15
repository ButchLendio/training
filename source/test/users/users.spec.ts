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

    it("Add new user - POST/users", async() =>{
        presentUsername=randomUsername
        presentPassword=randomPassword
        const res = await Request(Server).post("/users")
        .send({username:randomUsername,password:randomPassword})
        .set({ Authorization:`Bearer ${token}`})
        expect(res.status).to.equal(200)
    })

    it("Without token - POST/users", async() =>{
        presentUsername=randomUsername
        presentPassword=randomPassword
        const res = await Request(Server).post("/users")
        .send({username:randomUsername,password:randomPassword})
        expect(res.status).to.equal(400)
    })

    it("User already exist - POST/users", async() =>{
       const res = await Request(Server).post("/users")
        .send({username:presentUsername,password:presentPassword})
        expect(res.status).to.equal(400)
    })

    it("Username require - POST/users", async() =>{
        const res = await Request(Server).post("/users")
        .send({password:randomPassword})
        .set({ Authorization:`Bearer ${token}`})
        expect(res.status).to.equal(400)
    })

    it("Password require - POST/users", async() =>{
        const res = await Request(Server).post("/users")
        .send({username:randomUsername})
        .set({ Authorization:`Bearer ${token}`})
        expect(res.status).to.equal(400)
    })
})
