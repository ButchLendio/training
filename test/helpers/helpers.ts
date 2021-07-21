import {internet,commerce,datatype} from "faker"
import Products from '../../source/models/products';
import  Request  from 'supertest';
import server from '../../source/server'


export function generateFakeUser() {
    return {
        name: internet.userName(),
        username: internet.userName(),
        password: internet.password(),
    }
}

export function generateFakeProduct() {
    return {
        id:datatype.uuid(),
        name: commerce.product(),
        price: commerce.price()
    }
}

export async function addFakeUser(fakeUser:{name:string,username:string,password:string}) {
     await Request(server).post("/users")
    .send({name:fakeUser.name})
    .auth(fakeUser.username,fakeUser.password,{type: "basic"})
   
    const res = await Request(server).post("/auth")
    .auth(fakeUser.username,fakeUser.password,{type: "basic"})
    
    return (res.body.token)
    
}

export async function addFakeProduct(fakeProduct:{id:string,name:string,price:string},token:string) {

    const res = await Request(server).post("/products")
    .send({
        id:fakeProduct.id,
        name:fakeProduct.name,
        price:Number(fakeProduct.price)})
    .set('Authorization',`Bearer ${token}`)

    return(res.body.res)
}

export async function populateProduct(token:string) {
     await Request(server).post("/products")
    .send({
        id:datatype.uuid(),
        name: commerce.product(),
        price: Number(commerce.price())})
    .set('Authorization',`Bearer ${token}`)

    await Request(server).post("/products")
    .send({
        id:datatype.uuid(),
        name: commerce.product(),
        price: Number(commerce.price())})
    .set('Authorization',`Bearer ${token}`)

    await Request(server).post("/products")
    .send({
        id:datatype.uuid(),
        name: commerce.product(),
        price: Number(commerce.price())})
    .set('Authorization',`Bearer ${token}`)

    await Request(server).post("/products")
    .send({
        id:datatype.uuid(),
        name: commerce.product(),
        price: Number(commerce.price())})
    .set('Authorization',`Bearer ${token}`)

    await Request(server).post("/products")
    .send({
        id:datatype.uuid(),
        name: commerce.product(),
        price: Number(commerce.price())})
    .set('Authorization',`Bearer ${token}`)

    await Request(server).post("/products")
    .send({
        id:datatype.uuid(),
        name: commerce.product(),
        price: Number(commerce.price())})
    .set('Authorization',`Bearer ${token}`)

    await Request(server).post("/products")
    .send({
        id:datatype.uuid(),
        name: commerce.product(),
        price: Number(commerce.price())})
    .set('Authorization',`Bearer ${token}`)

    await Request(server).post("/products")
    .send({
        id:datatype.uuid(),
        name: commerce.product(),
        price: Number(commerce.price())})
    .set('Authorization',`Bearer ${token}`)

    await Request(server).post("/products")
    .send({
        id:datatype.uuid(),
        name: commerce.product(),
        price: Number(commerce.price())})
    .set('Authorization',`Bearer ${token}`)

    await Request(server).post("/products")
    .send({
        id:datatype.uuid(),
        name: commerce.product(),
        price: Number(commerce.price())})
    .set('Authorization',`Bearer ${token}`)
}
