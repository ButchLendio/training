import  Request  from 'supertest';
import Expect from 'chai'
import {internet} from "faker"
import Server from '../../server'
import Users from "../../models/users"

afterEach(() => {
    Users.deleteMany({name:randomUsername}).exec()
})
let randomUsername,
    randomPassword,
    presentUsername,
    presentPassword

describe("Users Test", ()=>{
    
    before(()=>{
        randomUsername=internet.userName();
        randomPassword = internet.password();
    })

    it("Add new user - POST/users", async() =>{
        presentUsername=randomUsername
        presentPassword=randomPassword
        await Request(Server).post("/users")
        .send({username:"Butch",password:"1234"})
        
        .then(async res =>{
            const freshAddedUser = await Users.count({username:res.body.username}).exec()

            Expect(res.status).to.equal(201)
            Expect(freshAddedUser).to.equal(1)
        })
        .catch(error => error)
    })

    it("Add new user - POST/users", async() =>{
        presentUsername=randomUsername
        presentPassword=randomPassword
        await Request(Server).post("/users")
        .send({username:randomUsername,password:randomPassword})
        
        .then(async res =>{
            const freshAddedUser = await Users.count({username:res.body.username}).exec()

            Expect(res.status).to.equal(201)
            Expect(freshAddedUser).to.equal(1)
        })
        .catch(error => error)
    })

    it("User already exist - POST/users", async() =>{
        await Request(Server).post("/users")
        .send({username:presentUsername,password:presentPassword})
        .then(async res =>{
            Expect(res.status).to.equal(400)
        })
        .catch(error => error)
    })
})
