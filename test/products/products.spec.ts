import  Request  from 'supertest';
import {expect} from 'chai'
import Server from '../../source/server'
import Products from '../../source/models/products'
import Users from "../../source/models/users"
import Bcryptjs from 'bcryptjs';
import {
    generateFakeUser,
    generateFakeProduct,
    addFakeUser,
    addFakeProduct} from '../helpers/helpers'

describe("Product Test",()=>{

after(async function () {
        await Products.deleteMany({})
    })

    it("Add product - POST/products", async function(){
        const userCreate = generateFakeUser()
        await Users.create({
            ...userCreate,
            password:await Bcryptjs.hash(userCreate.password,10)
        })
        const getToken = await Request(Server).post("/auth")
        .auth(userCreate.username,userCreate.password)
        const token = getToken.body.token

        const res = await Request(Server).post("/products")
        .send({
            id:generateFakeProduct().id,
            name:generateFakeProduct().name,
            price:Number(generateFakeProduct().price)})
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(200)  
    })

    it("Unauthorized - POST/products", async function(){
        const userCreate = generateFakeUser()
        const token = await addFakeUser(userCreate)

        const res = await Request(Server).post("/products")
        .send({
            id:generateFakeProduct().id,
            name:generateFakeProduct().name,
            price:generateFakeProduct().price})
        expect(res.status).to.equal(400)  
        expect(res.text).to.equal("Not allowed")
    })

    it("Id required - POST/products", async function(){
        const userCreate = generateFakeUser()
        const token = await addFakeUser(userCreate)

        const res = await Request(Server).post("/products")
        .send({
            id:'',
            name:generateFakeProduct().name,
            price:Number(generateFakeProduct().price)})
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(400) 
        expect(res.text).to.equal("Id required")
    })

    it("Price must be a number - POST/products", async function(){
        const userCreate = generateFakeUser()
        const token = await addFakeUser(userCreate)

        const res = await Request(Server).post("/products")
        .send({
            id:generateFakeProduct().id,
            name:generateFakeProduct().name,
            price:(generateFakeProduct().price)})
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(400) 
        expect(res.text).to.equal("Price must be number")
    })

    it("Name must be a string - POST/products", async function(){
        const userCreate = generateFakeUser()
        const token = await addFakeUser(userCreate)

        const res = await Request(Server).post("/products")
        .send({
            id:generateFakeProduct().id,
            name:Number(generateFakeProduct().price),
            price:Number(generateFakeProduct().price)})
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(400)  
        expect(res.text).to.equal("Name must be string")
    })

    it("Name required - POST/products", async function(){
        const userCreate = generateFakeUser()
        const token = await addFakeUser(userCreate)

        const res = await Request(Server).post("/products")
        .send({
            id:generateFakeProduct().id,
            name:'',
            price:Number(generateFakeProduct().price)})
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(400)  
        expect(res.text).to.equal("Name required")
    })

    it("Price required - POST/products", async function(){
        const userCreate = generateFakeUser()
        const token = await addFakeUser(userCreate)

        const res = await Request(Server).post("/products")
        .send({
            id:generateFakeProduct().id,
            name:generateFakeProduct().name,
            price:''})
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(400) 
        expect(res.text).to.equal("Price required")
    })

    it("Update product - POST/products/:id", async function(){
        const userCreate = generateFakeUser()
        const fakeProduct = generateFakeProduct()
        const token = await addFakeUser(userCreate)
        const addMockProduct = await addFakeProduct(fakeProduct, token)

        const res = await Request(Server).patch(`/products/${addMockProduct._id}`)
        .send({
            price:Number(generateFakeProduct().price)})
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(200) 
    })

    it("Update product - POST/products/:id", async function(){
        const userCreate = generateFakeUser()
        const fakeProduct = generateFakeProduct()
        const token = await addFakeUser(userCreate)
        const addMockProduct = await addFakeProduct(fakeProduct, token)
        const res = await Request(Server).patch(`/products/${addMockProduct._id}`)
        .send({
            name:generateFakeProduct().name,
            price:Number(generateFakeProduct().price)})
        .set('Authorization',`Bearer ${token}`)

        expect(res.status).to.equal(200)
        expect(res.body.updateProduct.ok).to.equal(1)
    })
    
    it("Unauthorized - POST/products/:id", async function(){
        const userCreate = generateFakeUser()
        const fakeProduct = generateFakeProduct()
        const token = await addFakeUser(userCreate)
        const addMockProduct = await addFakeProduct(fakeProduct, token)

        const res = await Request(Server).patch(`/products/${addMockProduct._id}`)
        .send({
            name:generateFakeProduct().name,
            price:Number(generateFakeProduct().price)})
        expect(res.status).to.equal(400) 
        expect(res.text).to.equal("Not allowed")

    })

    it("Delete product - POST/products/:id", async function(){
        const userCreate = generateFakeUser()
        const fakeProduct = generateFakeProduct()
        const token = await addFakeUser(userCreate)
        const addMockProduct = await addFakeProduct(fakeProduct, token)

        const res = await Request(Server).delete(`/products/${addMockProduct._id}`)
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(200) 

    })

    it("Not the owner of the product - POST/products/:id", async function(){
        const userCreate = generateFakeUser()
        const userCreateMock = generateFakeUser()

        const fakeProduct = generateFakeProduct()
        const token = await addFakeUser(userCreate)
        const tokenMock = await addFakeUser(userCreateMock)

        const addMockProduct = await addFakeProduct(fakeProduct, token)

        const res = await Request(Server).delete(`/products/${addMockProduct._id}`)
        .set('Authorization',`Bearer ${tokenMock}`)
        expect(res.status).to.equal(400) 
        expect(res.text).to.equal("Not the owener of the product")
    })

    it("Unauthorized - POST/products/:id", async function(){
        const userCreate = generateFakeUser()
        const fakeProduct = generateFakeProduct()
        const token = await addFakeUser(userCreate)
        const addMockProduct = await addFakeProduct(fakeProduct, token)

        const res = await Request(Server).delete(`/products/${addMockProduct._id}`)
        expect(res.status).to.equal(400) 
        expect(res.text).to.equal("Not allowed")
    })

})