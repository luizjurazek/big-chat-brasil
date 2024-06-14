# BCB - Big chat Brasil

## Descrição do projeto

O projeto foi criado utilizando as técnologias NodeJS, Typescript, Sequelize, Swagger, Postgres e tem o objetivo de simular um enviador de SMS.


## Como rodar o projeto
### 1º Passo: clonar o projeto
Para clonar o projeto basta rodar o comando abaixo no git bash
`git clone https://github.com/luizjurazek/big-chat-brasil.git`

### 2º Passo: instalar os pacotes do npm
Agora na pasta em que clonou o projeto, basta abrir o terminal e digitar o seguinte comando:
`npm install`

### 3º Passo: rodar container com postgres do docker
Faça o download do container no seguinte link: 
Na pasta do projeto inseira o arquivo postgres-bcb.tar, basta rodar os seguinte comandos para inicializar o container:
`docker load <substituir-pela-localizao-atual>\big-chat-brasil\postgres-bcb.tar`

E logo após inicializar o container:
`docker load -i postgres-bcb.tar`

Verifique se a imagem foi criada:
`docker images`

Agora, você pode rodar um novo container a partir da imagem importada. Use o comando:
`docker run -d --name meu-postgres-container -p 5432:5432 postgres-bcb`

### 4º Passo: inicialize o projeto
Agora utilize o seguinte comando para rodar o projeto:
`npm run start:dev`

E pronto o projeto vai estar rodando....

### Features

- [x] Cadastro de cliente
- [x] Ver informações de um cliente
- [x] Verificar o saldo de um cliente
- [x] Adicionar créditos para clientes com o plano pré-pago
- [x] Alterar o limite dos clientes com o plano pós-pago
- [x] Veficar o saldo dos dois tipos de clientes
- [x] Enviar uma mensagem utilizando o saldo do cliente

#### Endpoints do cliente

- POST: /client/create-client
  Deve receber um objeto json via body semelhante a:
  {
  "name": "brasao",
  "email": "brasao@gmail.com",
  "phone": "(24)09999-9999",
  "cpf": "111.222.333-45",
  "responsible": "Luiz",
  "cnpj": "21.345.678/0001-90",
  "company_name": "Jurazek company",
  "type_plan": "pos-pago",
  "credits": 0,
  "limit": 10
  }
  Caso o usuário seja do tipo pré-pago, deve ser inserido um valor no credits ou manter zerado, o limit será zerado automaticamente
  Caso contrário deve ser inserido um valor no limit ou manter zerado, o credits será zerado
  Assumindo que um usuário o plano pré-pago não pode ter um limit e o usuário do plano pos-pago não pode ter créditos
  Retorna de sucesso retorna um json com os dados do cliente cadastrado

- GET: /client/get-info-client/:id
  Deve ser enviado o id do cliente via parametro que deseja buscar informações, em caso de sucesso retornar um json com todas as infos do cliente

- GET: /client/check-balance/:id
  Deve ser enviado o id do cliente via parametro, retorna um objeto json com os credits caso o cliente seja pré-pago, caso contrário retorna limite, limite usado e o saldo do cliente

- PATCH: /client/add-credit
  Deve ser enviado id do cliente e amount em um json, semelhante a:
  {
  "id": 6,
  "amount": 2
  }

  Só será adicionados créditos a usuários do plano pré-pago

- PATCH: /client/alter-plan/
  Deve ser enviado o id do cliente que deseja alterar o plano:
  {
  "id": 1
  }

- PATCH: /client/alter-limit/
  Deve ser enviado um json com id e new limit:
  {
  "id": 1,
  "new_limit": 15.50
  }
  só será alterado o limite para clientes do tipo pós pago e deve retornar o antigo e novo limite

#### Endpoints do sms

- POST: /sms/send-message
  Deve ser enviado um json com phone, isWhatsApp, message e id_client que é uma chave estrangeiro e o usuário deve ser cadastrado previamente
  {
  "phone": "(44)988201874",
  "isWhatsApp": true,
  "message": "Olá, tudo bem?",
  "id_client": 5
  }

  Deve retornar um objeto json com informações do cliente e da mensagem enviada
