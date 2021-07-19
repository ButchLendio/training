import {internet,commerce,datatype} from "faker"
import  Request  from 'supertest';
import Server from '../../source/server'


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
     await Request(Server).post("/users")
    .send({name:fakeUser.name})
    .auth(fakeUser.username,fakeUser.password,{type: "basic"})
   
    const res = await Request(Server).post("/auth")
    .auth(fakeUser.username,fakeUser.password,{type: "basic"})
    
    return (res.body.token)
    
}

export async function addFakeProduct(fakeProduct:{id:string,name:string,price:string},token:string) {

    const res = await Request(Server).post("/products")
    .send({
        id:fakeProduct.id,
        name:fakeProduct.name,
        price:Number(fakeProduct.price)})
    .set('Authorization',`Bearer ${token}`)

    return(res.body.res)
}
