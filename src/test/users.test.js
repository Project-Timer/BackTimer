const app = require('../app.js')
const supertest = require('supertest')
const request = supertest(app)
const { setupDB } = require('./test-setup')

describe('User register Test', () => {
    setupDB()

    it('check user status route', async done => {
        const response = await request.get('/users')
        expect(response.status).toBe(401)
        done()
    })
    it('check lastname required', async(done) => {
        request
            .post('/register')
            .set('Accept', 'application/json')
            .send({
                "lastName":"",
                "firstName":"test",
                "email":"c.buyuk@outloo.com",
                "password":"azertyui"
            })
            .then(response => {
                expect(response.status).toBe(400);
                done();
            });
    });
    it('check firstName required', async(done) => {
        request
            .post('/register')
            .set('Accept', 'application/json')
            .send({
                "lastName":"test",
                "firstName":"",
                "email":"c.buyuk@outloo.com",
                "password":"azertyui"
            })
            .then(response => {
                expect(response.status).toBe(400);
                done();
            });
    });
    it('check email required', async(done) => {
        request
            .post('/register')
            .set('Accept', 'application/json')
            .send({
                "lastName":"test",
                "firstName":"test",
                "email":"",
                "password":"azertyui"
            })
            .then(response => {
                expect(response.status).toBe(400);
                done();
            });
    });
    it('check password required', async(done) => {
        request
            .post('/register')
            .set('Accept', 'application/json')
            .send({
                "lastName":"test",
                "firstName":"test",
                "email":"test",
                "password":""
            })
            .then(response => {
                expect(response.status).toBe(400);
                done();
            });
    });
    it('check valide email format', async(done) => {
        request
            .post('/register')
            .set('Accept', 'application/json')
            .send({
                "lastName":"test",
                "firstName":"test",
                "email":"test",
                "password":"test"
            })
            .then(response => {
                expect(response.status).toBe(400);
                done();
            });
    });
    it('check valid password more than 8 characters', async(done) => {
        request
            .post('/register')
            .set('Accept', 'application/json')
            .send({
                "lastName":"test",
                "firstName":"test",
                "email":"test@gmail.com",
                "password":"t"
            })
            .then(response => {
                console.log(response.body)
                expect(response.status).toBe(400);
                expect(response.body.message).toBe('Please insert a password of more than 8 characters');
                done();
            });
    });
    it('insert user', async(done) => {
        request
            .post('/register')
            .set('Accept', 'application/json')
            .send({
                "lastName":"test",
                "firstName":"test",
                "email":"test@gmail.com",
                "password":"teresetee"
            })
            .then(response => {
                console.log(response.body)
                expect(response.status).toBe(200);
                done();
            });
    });
    it('Register user', async(done) => {
        request
            .post('/register')
            .set('Accept', 'application/json')
            .send({
                "lastName":"test",
                "firstName":"test",
                "email":"test@gmail.com",
                "password":"teresetee"
            })
            .then(response => {
                console.log(response.body)
                expect(response.status).toBe(200);
                expect(response.body._id).toBeDefined()
                expect(response.body.firstName).toBe('test');
                expect(response.body.lastName).toBe('test');
                expect(response.body.email).toBe('test@gmail.com');
                done();
            });
    });
    it('email is already used', async(done) => {
        request
            .post('/register')
            .set('Accept', 'application/json')
            .send({
                "lastName":"test",
                "firstName":"test",
                "email":"test@gmail.com",
                "password":"teresetee"
            })
            .then(()=>{
                request
                    .post('/register')
                    .set('Accept', 'application/json')
                    .send({
                        "lastName":"test",
                        "firstName":"test",
                        "email":"test@gmail.com",
                        "password":"teresetee"
                    })
                    .then(response => {
                        console.log(response.body)
                        expect(response.status).toBe(500);
                        expect(response.body.message).toBe('This email is already used');
                        done();
                    })
            });
    });

})
describe('User authentication  Test', () => {
    setupDB()

    it('check email required', async(done) => {
        request
            .post('/login')
            .set('Accept', 'application/json')
            .send({
                "email":"",
                "password":"azertyui"
            })
            .then(response => {
                expect(response.status).toBe(400);
                expect(response.body.message).toBe('Email or password is not valid');
                done();
            });
    });
    it('check password required', async(done) => {
        request
            .post('/login')
            .set('Accept', 'application/json')
            .send({
                "email":"test@test.com",
                "password":"azertyui"
            })
            .then(response => {
                expect(response.status).toBe(403);
                expect(response.body.message).toBe('Email or password is not valid');
                done();
            });
    });
    it('login to email and password', async(done) => {
        request
            .post('/register')
            .set('Accept', 'application/json')
            .send({
                "lastName":"test",
                "firstName":"test",
                "email":"test@gmail.com",
                "password":"teresetee"
            })
            .then(()=>{
                request
                    .post('/login')
                    .set('Accept', 'application/json')
                    .send({
                        "email":"test@gmail.com",
                        "password":"teresetee"
                    })
                    .then(response => {
                        console.log(response.body)
                        expect(response.status).toBe(500);
                        expect(response.body.message).toBe('This email is already used');
                        done();
                    })
            });
    });


})
