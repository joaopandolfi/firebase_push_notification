# app_push_notifications
Documentação básica da API Push Notification

## API Push Notification
Ferramentas

* FCM
* MySQL
* CRON

### Rotas

* Enviar push para lista de usuários
```
@method PUT
@route [servidor]:[porta]/push/list
@data
{
    title: String,
    text: String,
    tag: String,
    senderId: String,
    pushIds: String {Format:<pushId1,pushId2,pushId3>}
}
  
@return
    @success 
	{
  success: true,
        data: [<pushId>]
}
    @error
    	{
  success: false,
        message: String
}

@note pushId valid separators ','  '.'  ';'
```

* Agendar push para lista de usuários
```
@method PUT
@route [servidor]:[porta]/push/schedule
@data
{
    title: String,
    text: String,
    date: String {Format: YYYY-MM-DD HH:MM:SS},
    tag: String,
    senderId: String,
    pushIds: String {Format:<pushId1,pushId2,pushId3>}
}
  
@return
    @success 
	{
  success: true,
        data: [<pushId>]
}
    @error
    	{
  success: false,
        message: String
}

@note pushId valid separators ','  '.'  ';'
```


* Busca lista de mensagens enviadas
```
@method GET
@route [servidor]:[porta]/push/list/all
@return
    @success 
	{
    success: true,
        data:
            [
                {
                    messageId: Int,
                    title: String,
                    text: String,
                    filter: String,
                    timestamp: String,
                    notSended:[{<pushId>}],
                    sended:[{<pushId>,<sendTimestamp>}],
                    opened:[{<pushId>,<sendTimestamp>,<openedTimestamp>}]
                }
            ]
  	}
    @error
    	{
        success: false,
        message: String
        }

```


* Busca lista de mensagens enviadas simplificada

```
@method GET
@route [servidor]:[porta]/push/list
@return
    @success 
	{
  success: true,
        data:
            [
                messageId: Int,
                title: String,
                text: String,
                filter: String,
                timestamp: String,
            ]
  	}
    @error
    	{
            success: false,
            message: String
        }

```


* Busca lista de mensagens enviadas por ID
```
@method GET
@route [servidor]:[porta]/push/list:Id

@return
    @success 
	{
        success: true,
        data:
            {
                messageId: Int,
                title: String,
                text: String,
                notSended:[{<pushId>}],
                sended:[{<pushId>,<sendTimestamp>}],
                opened:[{<pushId>,<sendTimestamp>,<openedTimestamp>}]
            }
  	}
    @error
    {
        success: false,
        message: String
    }

```


#### TODO
Trigger para setar mensagem como enviada
/root/PushClicked/:trash
{
    messageID:
    pushID:
    time:
} 

#### ANOTAÇÕES
Tem uma string *version* dentro do userDevice, fazer filtro de envio para ela


#### CRON
Esse processo usa um agendamento no cron que fica configurado em um projeto centralizado
