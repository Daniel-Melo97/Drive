const Helpers = use('Helpers')
const path = use('path')
const fs = use('fs')
const User = use('App/Models/User')


class FileTests{

    async uploadFileTest(){
        const { test, trait } = use('Test/Suite')('Testando upload de arquivo')

        trait('Test/ApiClient')
        trait('Auth/Client')

        

        test('Fazendo Upload', async({client, assert}) =>{
            

            const user = await User.find(1)

            const conteudo_original = fs.readFileSync(path.join(Helpers.appRoot('files-for-tests'),'teste.txt'), 'utf8')



            const response = await client.post('/file')
                                        .loginVia(user, 'jwt')
                                        .field('test', 'true')
                                        .attach('file', path.join(Helpers.appRoot('files-for-tests'),'teste.txt'))
                                        .end()

            response.assertStatus(200)
            response.assertJSONSubset({
                filename: "teste.txt",
                ext: "txt",
                user_id: 1
            })
            const conteudo_upado = fs.readFileSync(path.join(Helpers.appRoot('uploads-test'),response.body.storedname), 'utf8')

            assert.equal(conteudo_original,conteudo_upado)

        })
    }

    async existFileTest(){
        const { test, trait } = use('Test/Suite')('Testando a função que verifica existência de arquivos')

        trait('Test/ApiClient')
        trait('Auth/Client')

        test('Verificando', async({client, assert})=>{
            const user = await User.find(1)
            
            const response = await client.get('/file')
                                    .loginVia(user, 'jwt')
                                    .attach('file', path.join(Helpers.appRoot('files-for-tests'),'teste.txt'))
                                    .end()

            assert.equal(response.text, 'Há um arquivo com o mesmo nome')


            const response2 = await client.get('/file')
                                    .loginVia(user, 'jwt')
                                    .attach('file', path.join(Helpers.appRoot('files-for-tests'),'outroarquivo.txt'))
                                    .end()

            assert.equal(response2.text, 'Não há arquivos com esse nome')

        })
    }
    async updateFileTest(){
        const { test, trait } = use('Test/Suite')('Testando a atualização de arquivo')

        trait('Test/ApiClient')
        trait('Auth/Client')

        test('Atualizando', async({client, assert}) => {
            const user = await User.find(1)

            const response = await client.put('/file')
                                    .loginVia(user, 'jwt')
                                    .field('test', 'true')
                                    .attach('file', path.join(Helpers.appRoot('files-for-tests2'),'teste.txt'))
                                    .end()

           const arquivo_sobrescrevido = fs.readFileSync(path.join(Helpers.appRoot('uploads-test'),response.body.storedname), 'utf8')

           assert.equal('Apenas para testar o update', arquivo_sobrescrevido)


        })
    }

    async renameFileTest(){
        const { test, trait } = use('Test/Suite')('Testando a renomeação de arquivos')

        trait('Test/ApiClient')
        trait('Auth/Client')

        test('Renomeando', async({client, assert}) => {
            const user = await User.find(1)

            const response = await client.put('/rename')
                                    .loginVia(user, 'jwt')
                                    .send({
                                        nome_novo: 'nome_atualizado.txt',
                                        nome_antigo: 'teste.txt',
                                        test: true
                                    })
                                    .end()
            
            const arquivo_renomeado = fs.readFileSync(path.join(Helpers.appRoot('uploads-test'),response.body.storedname), 'utf8')
            
            assert.equal('Apenas para testar o update', arquivo_renomeado)

        })

    }

    async removeFileTest(){
        const { test, trait } = use('Test/Suite')('Testando a remoção de arquivos')

        trait('Test/ApiClient')
        trait('Auth/Client')

        test('Removendo', async({client, assert}) => {
            const user = await User.find(1)

            const response = await client.delete('/file')
                                    .loginVia(user, 'jwt')
                                    .send({
                                        nome: 'nome_atualizado.txt',
                                        test: true
                                    })
                                    .end()
            response.assertStatus(204) 

            const files = fs.readdirSync(Helpers.appRoot('uploads-test'))

            assert.equal(files.length, 0)
            
        })
        
    }
}

module.exports = FileTests