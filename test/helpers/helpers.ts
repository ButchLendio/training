import {internet} from "faker"

export function generateFakeUser() {
    return {
        name: internet.userName(),
        username: internet.userName(),
        password: internet.password()
       }
  }
