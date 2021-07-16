import {internet,commerce} from "faker"

export function generateFakeUser() {
    return {
        name: internet.userName(),
        username: internet.userName(),
        password: internet.password()
    }
}

export function generateFakeProduct() {
    return {
        name: commerce.product(),
        price: commerce.price()
    }
}
