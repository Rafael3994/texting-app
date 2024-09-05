// test/user.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/user/user.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let userId: string = '154f1266-1f99-4735-9c83-f64e22fed32b';
  let adminToken;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = moduleFixture.get<UserService>(UserService);
    await app.init();

    const authResponse = await request(app.getHttpServer())
      .post('/auth/login')  // Asegúrate de que esta ruta sea correcta para obtener el token
      .send({
        email: 'userTest@gmail.com',  // Asegúrate de que estos datos sean correctos
        password: 'userTest',
      })
      .expect(200);

    adminToken = JSON.parse(authResponse.text).access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/user (POST) should create a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/user')
      .send({
        name: 'userTeste2e',
        email: 'userTeste2e@gmail.com',
        password: 'userTeste2e',
      })
      .expect(201);

    expect(response.body).toHaveProperty('email', 'userTeste2e@gmail.com');
    expect(response.body).toHaveProperty('name', 'userTeste2e');
    expect(response.body).not.toHaveProperty('password');
  });

  it('/user/:id (DELETE) should delete a user', async () => {
    await request(app.getHttpServer())
      .delete(`/user/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect(response => {
        expect(response.body).toHaveProperty('email', 'userTeste2e@gmail.com');
        expect(response.body).toHaveProperty('name', 'userTeste2e');
      });
  });
});
