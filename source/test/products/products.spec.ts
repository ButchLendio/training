import Request from 'supertest';
import { expect } from 'chai';
import { commerce, finance } from 'faker';
import Server from '../../server';
import Products from '../../models/products';

after(() => {
    Products.deleteMany({ name: randomItem }).exec();
});
let randomItem, randomAmount, presentItem, presentAmount, token, id;

describe('Product Test', () => {
    before(() => {
        randomItem = commerce.productName();
        randomAmount = finance.amount();
    });
    it('Login - POST/auth', async () => {
        const res = await Request(Server)
            .post('/auth')
            .send({ username: 'Butch', password: '1234' });
        token = res.body.token;
        id = res.body.user._id;
        expect(res.status).to.equal(200);
    });

    it('Add product - POST/products', async () => {
        presentItem = randomItem;
        presentAmount = randomAmount;

        const res = await Request(Server)
            .post('/products')
            .send({ name: randomItem, price: randomAmount, createdBy: id })
            .set({ Authorization: `Bearer ${token}` });
        expect(res.status).to.equal(200);
    });

    it('With out token - POST/products', async () => {
        const res = await Request(Server)
            .post('/products')
            .send({ name: randomItem, price: randomAmount, createdBy: id });
        expect(res.status).to.equal(400);
    });

    it('Product already exist- POST/products', async () => {
        const res = await Request(Server)
            .post('/products')
            .send({ name: presentItem, price: presentAmount , createdBy: id })
        expect(res.status).to.equal(400);
    });

    it('Name require - POST/products', async () => {
        const res = await Request(Server)
            .post('/products')
            .send({ price: presentAmount , createdBy: id })
            .set({ Authorization: `Bearer ${token}` });
        expect(res.status).to.equal(400);
    });

    it('Price require - POST/products', async () => {
        const res = await Request(Server)
            .post('/products')
            .send({ name: presentItem, createdBy: id })
            .set({ Authorization: `Bearer ${token}` });
        expect(res.status).to.equal(400);
    });

    it('Owner require - POST/products', async () => {
        const res = await Request(Server)
            .post('/products')
            .send({ name: presentItem, price: presentAmount})
            .set({ Authorization: `Bearer ${token}` });
        expect(res.status).to.equal(400);
    });

    // it('Add product - POST/products', async () => {
    //     const find = await Products.fin
    //     // const res = await Request(Server)
    //     //     .patch(`/products`)
    //     //     .send({ name: randomItem, price: randomAmount, createdBy: id })
    //     //     .set({ Authorization: `Bearer ${token}` });
    //     // expect(res.status).to.equal(200);
    // });
});
