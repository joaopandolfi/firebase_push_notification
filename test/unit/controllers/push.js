const Joi = require('joi');
const joiAssert = require('joi-assert');
const request = require('supertest');
const chai = require('chai');
const assert = require('assert');
const app = require('../../../app');
const PushController = require('../../../controller/push');
chai.use(require('chai-as-promised'));

describe('Teste de envio do push notification', () => {
  describe('Teste de validação de parâmetros', () => {
    it('Deve dar erro na requisição quando parâmetros não são enviados', (done) => {
        request(app)
        .put('/push/list')
        .expect('Content-Type', /json/)
        .expect(412,{
            'success': false,
            'message': "title  and text are required."
          },done);
    });

    it('Deve Passar quando os parametros são enviados', (done) => {

        let data = {
            text: 'Mensagem de texto - teste automatico',
            title: "MENSAGEM TESTE",
            pushIds: '1tYpYqsAvDVVnXUUR0aYRRciCF32',
            senderId: '0'
        }

        request(app)
        .put('/push/list')
        .send(data)
        .expect('Content-Type', /json/)
        .timeout(30000)
        .expect(201,done);
    });

    it('Deve Passar quando envio mais de um pushId separados por vírgula', (done) => {

        let data = {
            text: 'Mensagem de texto - teste automatico - Lista',
            title: "MENSAGEM TESTE - Lista",
            pushIds: '1tYpYqsAvDVVnXUUR0aYRRciCF32,bbaWbOXoGDOi2DVSeasp6R7uAbn1,FRFFHyJbAdWpwPxlgHrOvCrcI2c2,ias6tGjbHhOFpt19OXdTstbQECe2',
            senderId: '0',
            tag: 'Mensagem Lista Automatica'
        }

        request(app)
        .put('/push/list')
        .send(data)
        .expect('Content-Type', /json/)
        .timeout(30000)
        .expect(201,done);
    });

    it('Deve Passar quando agendo Pushs passando os pushId separados por vírgula', (done) => {

        let data = {
            text: 'Mensagem de automatização do serviço',
            title: "MENSAGEM TESTE - Atomatica",
            pushIds: '1tYpYqsAvDVVnXUUR0aYRRciCF32',
            senderId: '0',
            tag: 'Mensagem do teste automatico',
            date: '2018-06-26 16:15:00'
        }

        request(app)
        .put('/push/schedule')
        .send(data)
        .expect('Content-Type', /json/)
        .timeout(30000)
        .expect(201,done);
    });
  });
});
