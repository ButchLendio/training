import Jwt from 'jsonwebtoken';
import { Context } from 'koa';
import Config from '../configs/config';


export async function  verifyToken(
  ctx: Context,
  next
) {

  const [authenticationType, token] = ctx.get('Authorization').split(' ');
  let decoded;


  if (authenticationType !== 'Bearer') {
    ctx.throw(400, "Not allowed")
  }

  if (!token) {
    ctx.throw(400, "Must have token")
  }
  try {
    decoded = Jwt.verify(token, Config.token.secret);
  } catch (e) {
    ctx.throw(400, "Session")
  }
await next()  
}

