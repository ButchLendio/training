import  Request  from 'supertest';
import {expect} from 'chai'
import {internet} from "faker"
import Server from '../../server'
import Users from "../../models/users"
import Bcryptjs from 'bcryptjs';

describe("Users Test", ()=>{
    
afterEach(async function() {
       await Users.deleteMany({})
    })

    const user = {
        name: internet.userName(),
        username: internet.userName(),
        password: internet.password(),
      };

    it("Login - POST/auth", async function (){
        const userCreate = {
            name: internet.userName(),
            username: internet.userName(),
            password: internet.password(),
          };
        await Users.create({
            ...userCreate,
            password:await Bcryptjs.hash(userCreate.password,10)
        })

        const res = await Request(Server).post("/auth")
        .auth(userCreate.username,userCreate.password)
         expect(res.status).to.equal(200)  
    })

    it("Add user - POST/auth", async function (){     
        const res = await Request(Server).post("/users")
        .send({name:user.name})
        .auth(user.username,user.password)
         expect(res.status).to.equal(200)  
    })

    it("Name require - POST/auth", async function (){
        const res = await Request(Server).post("/users")
        .send({name:''})
        .auth( user.username, user.password)
         expect(res.status).to.equal(400)  
    })

    it("Username require - POST/auth", async function (){
        const res = await Request(Server).post("/users")
        .send({name: user.name})
        .auth('', user.password)
         expect(res.status).to.equal(400)  
    })

    it("Password require - POST/auth", async function (){
        const res = await Request(Server).post("/users")
        .send({name: user.name})
        .auth( user.username,'')
         expect(res.status).to.equal(400)  
    })


})


