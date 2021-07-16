import  Request  from 'supertest';
import {expect} from 'chai'
import {internet} from "faker"
import Server from '../../source/server'
import Users from "../../source/models/users"
import Bcryptjs from 'bcryptjs';

describe("Users Test", ()=>{
    
afterEach(async function() {
       await Users.deleteMany({})
    })

    it("Login - POST/auth", async function (){
        const user = {
            name: internet.userName(),
            username: internet.userName(),
            password: internet.password(),
          };
        await Users.create({
            ...user,
            password:await Bcryptjs.hash(user.password,10)
        })

        const res = await Request(Server).post("/auth")
        .auth(user.username,user.password)
         expect(res.status).to.equal(200)  
    })

    it("Add user - POST/auth", async function (){
        const user = {
            name: internet.userName(),
            username: internet.userName(),
            password: internet.password(),
          };
        const res = await Request(Server).post("/users")
        .send({name:user.name})
        .auth(user.username,user.password)
         expect(res.status).to.equal(200)  
    })

    it("Name require - POST/auth", async function (){
        const user = {
            name: internet.userName(),
            username: internet.userName(),
            password: internet.password(),
          };
        const res = await Request(Server).post("/users")
        .send({name:''})
        .auth(user.username,user.password)
         expect(res.status).to.equal(400)  
    })

    it("Username require - POST/auth", async function (){
        const user = {
            name: internet.userName(),
            username: internet.userName(),
            password: internet.password(),
          };
        const res = await Request(Server).post("/users")
        .send({name:user.name})
        .auth('',user.password)
         expect(res.status).to.equal(400)  
    })

    it("Password require - POST/auth", async function (){
        const user = {
            name: internet.userName(),
            username: internet.userName(),
            password: internet.password(),
          };
        const res = await Request(Server).post("/users")
        .send({name:user.name})
        .auth(user.username,'')
         expect(res.status).to.equal(400)  
    })


})


