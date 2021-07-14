import Jwt from 'jsonwebtoken';
import { Context } from 'koa';
import Config from '../configs/config'


async function  verifyToken(
  ctx: Context,
  next
) {

  const bearer = ctx.get('Authorization').split(' ');

  let allowed = true;
  let decoded;

  const token = bearer[1];

  if (bearer[0] !== 'Bearer') {
    allowed = false;
  }

  if (!token) {
    allowed = false;
  }
  try {
    decoded = Jwt.verify(token, Config.token.secret);
  } catch (e) {
    ctx.status=400
    ctx.body='Wrong Token'
    allowed = false;
    return
  }
await next()  
}


export default verifyToken ;