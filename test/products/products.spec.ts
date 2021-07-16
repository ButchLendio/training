import  Request  from 'supertest';
import {expect} from 'chai'
import Server from '../../source/server'
import Products from '../../source/models/products'
import Users from "../../source/models/users"
import Bcryptjs from 'bcryptjs';
import {generateFakeUser,generateFakeProduct} from '../helpers/helpers'

describe("",()=>{

afterEach(async function () {
        await Products.deleteMany({})
    })

    let token

    it("Add product - POST/products", async function(){
        const userCreate = generateFakeUser()
        await Users.create({
            ...userCreate,
            password:await Bcryptjs.hash(userCreate.password,10)
        })
        const getToken = await Request(Server).post("/auth")
        .auth(userCreate.username,userCreate.password)
        token = getToken.body.token

        const res = await Request(Server).post("/products")
        .send({name:generateFakeProduct().name,price:Number(generateFakeProduct().price)})
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(200)  
    })

    it("Anauthorized - POST/products", async function(){
        const res = await Request(Server).post("/products")
        .send({name:generateFakeProduct().name,price:(generateFakeProduct().price)})
        expect(res.status).to.equal(400)  
    })

    it("Price must be a number - POST/products", async function(){
        const res = await Request(Server).post("/products")
        .send({name:generateFakeProduct().name,price:(generateFakeProduct().price)})
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(400)  
    })

    it("Name must be a string - POST/products", async function(){
        const res = await Request(Server).post("/products")
        .send({name:Number(generateFakeProduct().price),price:Number(generateFakeProduct().price)})
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(400)  
    })

    it("Name required - POST/products", async function(){
        const res = await Request(Server).post("/products")
        .send({name:'',price:Number(generateFakeProduct().price)})
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(400)  
    })

    it("Price required - POST/products", async function(){
        const res = await Request(Server).post("/products")
        .send({name:generateFakeProduct().name,price:''})
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(400) 
    })

})