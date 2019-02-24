# Arquitetura antiga (06/2018)

## Envio do push

### Organização de dados

#### Firebase
/root/userNotification/:userId/:pushId

```
{
  date: String,
  read: Bool,
  text: String,
  title: String
}
```

# Arquitetura nova (18/06/2018)

## Acesso do dash
Usuário acessa o dash e agenda o envio do push notification

### Funcionamento do dash
Dash consome API para registro

## Funcionamento da API

### Se for agendamento
API recebe a requisição do Dash e cria serviço no CronJobs

### Salva na seguinte característica
Característica de envio

```
{
  title: String,
  text: String,
  date: Datetime,
  filter: String
}
```

#### Modelagem SQL

<p align="center">
  <img src="base_model.png" width="45%">
</p>

#### Funcionamento

Quando receber requisição, efetua filtro e salva os usuários filtrados na tabela *push_message_user*

Definir trigger no Firebase, quando o usuário **receber** e **ler** a notificação, atualizar a tabela *push_message_user*

Tabelas *push_message_user* e *push_messages*



## Links
[Cron Lib Nodejs](https://www.npmjs.com/package/node-cron)
