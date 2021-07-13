import  Request  from 'supertest';
import Expect from 'chai'
import {internet} from "faker"
import Server from '../../server'
import Users from "../../models/users"

afterEach(() => {
    Users.deleteMany({name:"tests"}).exec()
})

describe("Users Test", ()=>{
    let randomUsername,randomPassword
    
    before(()=>{
        randomUsername=internet.userName();
        randomPassword = internet.password();
    })

    it("Add new user - POST/users", async() =>{
        await Request(Server).post("/users")
        .send({username:randomUsername,password:randomPassword})
        .then(async res =>{
            const freshAddedUser = await Users.count({username:res.body.username}).exec()

            Expect(res.ststus).to.equal(201)
            Expect(freshAddedUser).to.equal(1)
        })
        .catch(error => error)
    })
})
