'use strict'


const User = use('App/Models/User')
const Database = use('Database')
const fs = use('fs')
const newPath = use('App/utils/newPath')

class UserController {
    async create({request}){
        const dados = request.only(['username', 'email', 'password'])

        const usuario_criado = await User.create(dados)

        return usuario_criado
    }

    async getUsers(){
        
        const resposta = await User.all()
        
        return resposta
    }

    async login({request,auth}){
        const {email, password} = request.all()
        
        const token = await auth.attempt(email,password)

        return  token
    }

    async updateUser({request, auth, response}){
        
        const dados = request.only(['username', 'email', 'password'])
        
        const user = await User.findOrFail(auth.user.id)
        
        user.merge(dados)
        const updated = await user.save()
        if(updated){
            return response.resetContent('updated user')
        }else{
            return response.badRequest()
        }
        
    }

    async deleteUser({request, auth, response}){
        const id = auth.user.id
        const test = request.body.test
        
        const files = await Database //buscar no BD, todos os arquivos associados a este usuário
                            .select('storedname')
                            .from('files')
                            .where({
                                user_id: id
                            })
        
        try{
            if(files.length > 0){//verifica se ele possui arquivos
                files.forEach(function(file){//removendo todos os arquivos da pasta
                    if(test == null){
                        fs.unlinkSync(newPath(file.storedname))
                    }else{
                        fs.unlinkSync(newPath(file.storedname,'uploads-test'))
                    }
                })
            }
            const user = await User.find(id)
            await user.delete() // deletando usuário
            response.noContent()
        }catch(err){
            response.send(err)
        }
        



    }
}

module.exports = UserController
