import  Request  from 'supertest';
import {expect} from 'chai'
import Server from '../../source/server'
import R from 'ramda'
import Users from "../../source/models/users"
import Bcryptjs from 'bcryptjs';
import {
    generateFakeUser,
    generateFakeProduct,
    addFakeUser,
    addFakeProduct,
    populateProduct} from '../helpers/helpers'

describe("Product Test",()=>{

// after(async function () {
//         await Products.deleteMany({})
//     })

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

    it("Update product - PATCH/products/:id", async function(){
        const userCreate = generateFakeUser()
        const fakeProduct = generateFakeProduct()
        const token = await addFakeUser(userCreate)
        const addMockProduct = await addFakeProduct(fakeProduct, token)
        const data={
            price:Number(generateFakeProduct().price)
        }

        const res = await Request(Server).patch(`/products/${addMockProduct._id}`)
        .send(data)
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(200) 
        expect(res.body.message).to.equal("Product updated")
        expect(res.body.product.price).to.equal(data.price.toString())
    })

    it("Update product - PATCH/products/:id", async function(){
        const userCreate = generateFakeUser()
        const fakeProduct = generateFakeProduct()
        const token = await addFakeUser(userCreate)
        const addMockProduct = await addFakeProduct(fakeProduct, token)
        const data={
            name:generateFakeProduct().name,
            price:Number(generateFakeProduct().price)
        }

        const res = await Request(Server).patch(`/products/${addMockProduct._id}`)
        .send(data)
        .set('Authorization',`Bearer ${token}`)

        expect(res.status).to.equal(200)
        expect(res.body.message).to.equal("Product updated")
        expect(res.body.product.name).to.equal(data.name)
        expect(res.body.product.price).to.equal(data.price.toString())
    })
    
    it("Unauthorized - PATCH/products/:id", async function(){
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

    it("Delete product - DELETE/products/:id", async function(){
        const userCreate = generateFakeUser()
        const fakeProduct = generateFakeProduct()
        const token = await addFakeUser(userCreate)
        const addMockProduct = await addFakeProduct(fakeProduct, token)

        const res = await Request(Server).delete(`/products/${addMockProduct._id}`)
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(200) 

    })

    it("Not the owner of the product - DELETE/products/:id", async function(){
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

    it("Unauthorized - DELETE/products/:id", async function(){
        const userCreate = generateFakeUser()
        const fakeProduct = generateFakeProduct()
        const token = await addFakeUser(userCreate)
        const addMockProduct = await addFakeProduct(fakeProduct, token)

        const res = await Request(Server).delete(`/products/${addMockProduct._id}`)
        expect(res.status).to.equal(400) 
        expect(res.text).to.equal("Not allowed")
    })

    it("Get product in default - GET/products", async function(){
        const userCreate = generateFakeUser()
        const token = await addFakeUser(userCreate)

        await populateProduct(token)

        const res = await Request(Server).get(`/products`)
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(200) 
        expect(res.body.products.length).to.equal(res.body.pageInfo.totalCount)

    })

    it("Get product limit 3 - GET/products", async function(){
        const userCreate = generateFakeUser()
        const token = await addFakeUser(userCreate)

        await populateProduct(token)

        const res = await Request(Server).get(`/products?first=3`)
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(200) 
        expect(res.body.products.length).to.equal(res.body.pageInfo.totalCount)
    })

    it("Get product limit 3 and given cursor - GET/products", async function(){
        const userCreate = generateFakeUser()
        const token = await addFakeUser(userCreate)

        await populateProduct(token)
  
        const foundCursor = await Request(Server).get(`/products?first=3`)
        .set('Authorization',`Bearer ${token}`) 
        const getCursor = foundCursor.body.products
        const cursor = R.head(getCursor).cursor

        const res = await Request(Server).get(`/products?first=3&after=${cursor}`)
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(200) 
        expect(res.body.products.length).to.equal(res.body.pageInfo.totalCount)
    })

    it("Unauthorized - GET/products", async function(){
        const userCreate = generateFakeUser()
        const token = await addFakeUser(userCreate)

        await populateProduct(token)
  
        const foundCursor = await Request(Server).get(`/products?first=3`)
        .set('Authorization',`Bearer ${token}`) 
        const getCursor = foundCursor.body.products
        const cursor = R.head(getCursor).cursor

        const res = await Request(Server).get(`/products?first=3&after=${cursor}&sort=name`)
        expect(res.status).to.equal(400) 
        expect(res.text).to.equal("Not allowed")
    })

})