const User = use('App/Models/User')
const fs = use('fs')
const newPath = use('App/utils/newPath')

class UserTests{
    async createUserTest(){

        const { test, trait } = use('Test/Suite')('Testando cadastro de um novo usuário')

        trait('Test/ApiClient')


        test('Criar um usuário', async({ client }) =>{
            
            const response = await client.post('/users').send({
                username: "Nome Teste Silva",
                email: "email@test.com",
                password: "senha"
            }).end()
          
            response.assertStatus(200)
            response.assertJSONSubset({
                username: "Nome Teste Silva",
                email: "email@test.com"
            })
        })
    }
    async loginTest(){
        const { test, trait } = use('Test/Suite')('Testando login de usuário')

        trait('Test/ApiClient')


        test('Fazendo login', async({ client, assert }) =>{
            
            const response = await client.post('/login').send({
                email: "email@test.com",
                password: "senha"
            }).end()

            response.assertStatus(200)
            assert.equal(response.body.type, 'bearer')
        })
    }
    async updateUserTest(){
            const { test, trait } = use('Test/Suite')('Testando atualização dos dados do usuário')

            trait('Test/ApiClient')
            trait('Auth/Client')
            


            test('Atualizando', async({ client, assert }) =>{

                const user = await User.find(1)
                

                const response = await client.put('/users')
                .loginVia(user, 'jwt')
                .send({
                    username: "outro nome teste",
                    email: "outroEmail@test.com",
                    password: "novasenha"
                }).end()

               
                response.assertStatus(205)
 
                const updated_user = await User.find(1)
                
                assert.equal(updated_user.username, "outro nome teste")
                assert.equal(updated_user.email, "outroEmail@test.com")
                 
            })
    }
    async listUsersTest(){

        const {test, trait} = use('Test/Suite')('Testando listagem de usuários')
        
        trait('Test/ApiClient')

        test('Listando', async({client, assert}) => {

            const response = await client.get('/').end()

            assert.equal(response.body.length, 1)
            
        })

    }

    async deleteUserTest(){

        const {test, trait} = use('Test/Suite')('Testanto remoção de usuário')

        trait('Test/ApiClient')
        trait('Auth/Client')
        

        test('Deletanto', async({client, assert, }) => {

            const user = await User.find(1)

            const upload = await client.post('/file')
                                .loginVia(user, 'jwt')
                                .field('test', 'true')
                                .attach('file', newPath('teste.txt','files-for-tests'))
                                .end()


            const response = await client.delete('users')
                                        .loginVia(user, 'jwt')
                                        .send({test: true})
                                        .end()
            
            response.assertStatus(204)
            assert.equal(fs.existsSync(newPath(upload.body.storedname,'uploads-test')), false)
            
        })

    }
    
}

module.exports = UserTests
