import  Request  from 'supertest';
import {expect} from 'chai'
import Server from '../../source/server'
import Users from "../../source/models/users"
import Bcryptjs from 'bcryptjs';
import {generateFakeUser} from '../helpers/helpers'

describe("Users Test", ()=>{
    
afterEach(async function() {
       await Users.deleteMany({})
    })

    it("Login - POST/auth", async function (){
        const userCreate = generateFakeUser()
        await Users.create({
            ...userCreate,
            password:await Bcryptjs.hash(userCreate.password,10)
        })
        const res = await Request(Server).post("/auth")
        .auth(userCreate.username,userCreate.password)
         expect(res.status).to.equal(200)  
    })

    it("Add user - POST/users", async function (){     
        const res = await Request(Server).post("/users")
        .send({name:generateFakeUser().name})
        .auth(generateFakeUser().username,generateFakeUser().password)
         expect(res.status).to.equal(200)  
    })

    it("Name require - POST/users", async function (){
        const res = await Request(Server).post("/users")
        .send({name:''})
        .auth( generateFakeUser().username, generateFakeUser().password)
         expect(res.status).to.equal(400)  
    })

    it("Username require - POST/users", async function (){
        const res = await Request(Server).post("/users")
        .send({name: generateFakeUser().name})
        .auth('', generateFakeUser().password)
         expect(res.status).to.equal(400)  
    })

    it("Password require - POST/users", async function (){
        const res = await Request(Server).post("/users")
        .send({name: generateFakeUser().name})
        .auth( generateFakeUser().username,'')
         expect(res.status).to.equal(400)  
    })


})


