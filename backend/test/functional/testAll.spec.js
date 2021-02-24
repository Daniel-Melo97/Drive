

const userTests = use('./userTests')
const fileTests = use('./fileTests')

const user = new userTests()
const file = new fileTests()

user.createUserTest() //testando criação de usuário

user.listUsersTest()//testando listagem de usuários

user.loginTest()// testando login do usuário criado

user.updateUserTest()//testando atualização de usuário

file.uploadFileTest()//testando uploads de arquivos

file.existFileTest()//testando a função que verifica existência de arquivos

file.updateFileTest()//testando o overwrite de arquivos

file.renameFileTest()//testando renomeação de arquivos

file.removeFileTest()//testando remoção de arquivos

user.deleteUserTest()

/*
TO DO LIST:
>CRIAR ROTA DE REMOÇÃO(USUÁRIO)
>CRIAR TESTES PARA AS ROTAS ACIMA
*/