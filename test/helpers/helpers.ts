import {internet,commerce,datatype} from "faker"

export function generateFakeUser() {
    return {
        name: internet.userName(),
        username: internet.userName(),
        password: internet.password()
    }
}

export function generateFakeProduct() {
    return {
        id:datatype.uuid(),
        name: commerce.product(),
        price: commerce.price()
    }
}
