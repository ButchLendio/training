import  Request  from 'supertest';
import {expect} from 'chai'
import {commerce,finance} from "faker"
import Server from '../../server'
import Products from "../../models/products"
import Users from "../../models/users"

afterEach(() => {
    Products.deleteMany({name:randomItem}).exec()
})
let randomItem,
    randomAmount,
    presentItem,
    presentAmount,
    token

describe("Product Test", ()=>{
    
    before(()=>{
        randomItem=commerce.productName()
        randomAmount=finance.amount()
    })
    it("Login - POST/auth", async() =>{
        const res = await Request(Server).post("/auth")
        .send({username:"Butch",password:"1234"})
        token=res.body.token
         expect(res.status).to.equal(200)  
    })

    it("Add product - POST/products", async() =>{
        presentItem = randomItem
        presentAmount = randomAmount
        const res = await Request(Server).post("/products")
        .send({name:randomItem,price:randomAmount})
        .set({ Authorization:`Bearer ${token}`})
         expect(res.status).to.equal(200)  
    })


    it("With out token - POST/products", async() =>{
        const res = await Request(Server).post("/products")
        .send({name:randomItem,price:randomAmount})
         expect(res.status).to.equal(400)  
    })

    it("Product already exist- POST/products", async() =>{
        const res = await Request(Server).post("/products")
        .send({name:presentItem,price:presentAmount})
        .set({ Authorization:`Bearer ${token}`})
         expect(res.status).to.equal(200)  
    })

    // it("Add new user - POST/users", async() =>{
    //     presentUsername=randomUsername
    //     presentPassword=randomPassword
    //     const res = await Request(Server).post("/users")
    //     .send({username:randomUsername,password:randomPassword})
    //     .set({ Authorization:`Bearer ${token}`})
    //     expect(res.status).to.equal(200)
    // })

    // it("Without token - POST/users", async() =>{
    //     presentUsername=randomUsername
    //     presentPassword=randomPassword
    //     const res = await Request(Server).post("/users")
    //     .send({username:randomUsername,password:randomPassword})
    //     expect(res.status).to.equal(400)
    // })

    // it("User already exist - POST/users", async() =>{
    //    const res = await Request(Server).post("/users")
    //     .send({username:presentUsername,password:presentPassword})
    //     expect(res.status).to.equal(400)
    // })
})
