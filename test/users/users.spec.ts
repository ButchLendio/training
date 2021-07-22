import  Request  from 'supertest';
import {expect} from 'chai'
import Server from '../../source/server'
import Users from "../../source/models/users"
import Products from "../../source/models/products"
import Bcryptjs from 'bcryptjs';
import R from 'ramda'

import {
    generateFakeUser,
    addFakeUser,
    populateProduct
} from '../helpers/helpers'

describe("Users Test", ()=>{
    
after(async function() {
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

    it("Get product in default by user - GET/:userId/products", async function(){
        const userCreate = generateFakeUser()
        const token = await addFakeUser(userCreate)
        const getUser = await Users.find()
        const getUserId=R.head(getUser)._id
        await populateProduct(R.head(getUser).username)

        const res = await Request(Server).get(`/${getUserId}/products`)
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(200) 
        expect(res.body.products.length).to.equal(res.body.pageInfo.totalCount)
    })

    it("Unauthorized - GET/:userId/products", async function(){
        const userCreate = generateFakeUser()
        const token = await addFakeUser(userCreate)
        const getUser = await Users.find()
        const getUserId=R.head(getUser)._id
        await populateProduct(R.head(getUser).username)

        const res = await Request(Server).get(`/${getUserId}/products`)
        expect(res.status).to.equal(400) 
        expect(res.text).to.equal("Not allowed")
    })

    it("Get product by user limit 3 - GET/:userId/products", async function(){
        const userCreate = generateFakeUser()
        const token = await addFakeUser(userCreate)
        const getUser = await Users.find()
        const getUserId=R.head(getUser)._id
        await populateProduct(R.head(getUser).username)

        const res = await Request(Server).get(`/${getUserId}/products?first=3`)
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(200) 
        expect(res.body.products.length).to.equal(res.body.pageInfo.totalCount)
    })

    it("Get product by user limit 3 given cursor- GET/:userId/products", async function(){
        const userCreate = generateFakeUser()
        const token = await addFakeUser(userCreate)
        const getUser = await Users.find()
        const getUserId=R.head(getUser)._id
        await populateProduct(R.head(getUser).username)

        const foundCursor = await Request(Server).get(`/${getUserId}/products`)
        .set('Authorization',`Bearer ${token}`) 
        const getCursor = foundCursor.body.products
        const cursor = R.head(getCursor).cursor

        const res = await Request(Server).get(`/${getUserId}/products?first=3&after=${cursor}`)
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(200) 
        expect(res.body.products.length).to.equal(res.body.pageInfo.totalCount)
    })

    it("Get product by user limit 3 given cursor sort by name - GET/:userId/products", async function(){
        const userCreate = generateFakeUser()
        const token = await addFakeUser(userCreate)
        const getUser = await Users.find()
        const getUserId=R.head(getUser)._id
        await populateProduct(R.head(getUser).username)

        const foundCursor = await Request(Server).get(`/${getUserId}/products`)
        .set('Authorization',`Bearer ${token}`) 
        const getCursor = foundCursor.body.products
        const cursor = R.head(getCursor).cursor

        const res = await Request(Server).get(`/${getUserId}/products?first=3&after=${cursor}&sort=name`)
        .set('Authorization',`Bearer ${token}`)
        expect(res.status).to.equal(200) 
        expect(res.body.products.length).to.equal(res.body.pageInfo.totalCount)
    })
    



})


