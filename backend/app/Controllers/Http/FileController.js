'use strict'

const Database = use('Database')
const Helpers = use('Helpers')
const generateUniqueFileName = use('App/utils/generateUniqueFileName')
const newPath = use('App/utils/newPath')
const File = use('App/Models/File')
const fs = use('fs')


class FileController {
    async displayFile({request, response}){ //retorna o arquivo para o navegador
      const id = request.params.id

      const file = await File.findOrFail(id)

      const storedname = file.storedname

      response.download(newPath(storedname))
   
    }
    async verifyFileExistence({request,auth, response}){ //verifica existência de arquivos com o mesmo nome.
      const file = request.file('file')
      const user_id = auth.user.id
      const filename = file.stream.filename
      

      const result = await Database
                  .select('filename')
                  .from('files')
                  .where({
                    filename: filename,
                    user_id : user_id
                  })
                  .first()
    
                 
      if(result == null){
        return response.send('Não há arquivos com esse nome')
      }else{
        return response.send('Há um arquivo com o mesmo nome')
      }

    }




    async uploadFile({request, auth}){
        const test = request.input('test', 'false')
        const file = request.file('file', { //recebemos o arquivo
            size: '2mb'
          })
        const filename = file.stream.filename //pegamos o nome do arquivo
        const storedname = generateUniqueFileName(filename) //geramos um nome que será usado para o mesmo na pasta uploads
        const ext = file.extname //pegamos a extensão do arquivo
        const user_id = auth.user.id //id do usuário que fez o upload
        /*
        TO DO LIST:
        RECEBER REQUEST.TEST, SE TRUE, DAR UPLOAD NA PASTA UPLOADS-TEST, CASO CONTRÁRIO, UPLOAD NORMAL
        
        */

        if(test == 'true'){//em caso de teste, usaremos a pasta uploads-test para upar os arquivos
          await file.move(Helpers.appRoot('uploads-test'), { //movemos o arquivo para a pasta uploads-test
            name: storedname
          })
        }else{//caso contrário, usaremos a pasta normal
          await file.move(Helpers.appRoot('uploads'), { //movemos o arquivo para a pasta uploads
            name: storedname
          })
        }  
      
        if (!file.moved()) { // em caso de erro, cancelamos o upload
          return file.error()
        }

        const dados = { //criando json para para persistir no BD
          storedname: storedname,
          filename: filename,
          ext: ext,
          user_id: user_id
        }

        const fileUploaded = await File.create(dados) //dando insert no BD

        return fileUploaded
    }

    async updateFile({request, auth, response}){// essa função irá sobrescrever o arquivo 
      const test = request.input('test', 'false')
      const file = request.file('file', { // recebe o arquivo novo
        size: '2mb'
      })
      const filename = file.stream.filename //nome do arquivo novo(deve ser igual ao nome do arquivo que vai ser sobrescrevido)
      const user_id = auth.user.id //id do usuário


      const oldFile = await Database //busca no BD a existência desse arquivo
                .select('storedname')
                .from('files')
                .where({
                  filename: filename,
                  user_id : user_id
                })
                .first()

      if(test == 'true'){
        await file.move(Helpers.appRoot('uploads-test'), { //caso o arquivo exista no BD, sobrescrevemos ele
          name: oldFile.storedname,
          overwrite: true
        })
      }else{
        await file.move(Helpers.appRoot('uploads'), { //caso o arquivo exista no BD, sobrescrevemos ele
          name: oldFile.storedname,
          overwrite: true
        })
      }          
      
    
      if (!file.moved()) { //em caso de erro na hora de sobrescrever, retornamos erro
        return file.error()
      }else{
        return response.send(oldFile)
      } 
    } 

    async renameFile({request,auth,response}){ //renomear arquivo
      const newName = request.body.nome_novo
      const oldName = request.body.nome_antigo
      const test = request.body.test
      const user_id = auth.user.id

      const newExtension = newName.split('.').pop() //pegar extensão do novo nome
      const oldExtension = oldName.split('.').pop() //pegar a extensão do nome antigo

      
      if(newExtension === oldExtension){// verifica se as extensões de arquivo são iguais, se for, renomear normalmente, caso contrário, retornar erro
          const file = await Database
                      .select('*')
                      .from('files')
                      .where({
                        filename: oldName,
                        user_id : user_id
                      })
                      .first()
          if(file == null){
            return response.status(404).send('Arquivo não encontrado')
          }
          const oldStoredName = file.storedname //pegar nome antigo do arquivo
          file.filename = newName //alterar o nome
          file.storedname = generateUniqueFileName(newName) //gerar nome unico pro novo nome do arquivo
          
          if(test == null){
            var renamedPath = newPath(file.storedname) //gerar novo endereço do arquivo a ser renomeado
            var oldpath = newPath(oldStoredName) //pegar endereço do arquivo a ser renomeado
          }else{
            var renamedPath = newPath(file.storedname, 'uploads-test') //gerar novo endereço do arquivo a ser renomeado
            var oldpath = newPath(oldStoredName, 'uploads-test') //pegar endereço do arquivo a ser renomeado
          }
          
          
          fs.rename(oldpath, renamedPath ,(e,err) => {//renomear arquivo na pasta
            if (err){
              throw err;
            } 
          })

          
          const updated = await Database //atualizar no BD
                                .table('files')
                                .where('id',file.id)
                                .update({
                                  filename: file.filename,
                                  storedname: file.storedname
                                })
          if(updated>0){
              return response.send(file)
          }else{
              fs.rename(renamedPath, oldpath,(e,err) => {// em caso de erro na atualização do BD, o arquivo será renomeado para o nome anterior
                if (err){
                  throw err;
                } 
              })
              return response.status(400).send('falha na atualização')
          } 
      }else{
        return response.status(404).send('Você não pode alterar a extensão do arquivo')
      }
      
      
      
    }

    async removeFile({request,auth,response}){
      const filename = request.body.nome //recebe nome do arquivo
      const test = request.body.test //em caso de teste, recebe um valor indicando que a função está sendo testada
      const user_id = auth.user.id

      const file = await Database // busca no BD o arquivo correspondente ao usuário que fez a consulta
                      .select('*')
                      .from('files')
                      .where({
                        filename: filename,
                        user_id : user_id
                      })
                      .first()
      if(file == null){//caso não encontre o arquivo, retornar mensagem
       response.status(404).send('Arquivo não encontrado')
      }
      try { //caso encontre o arquivo, remover da pasta uploads e também do BD
        if(test == null){//caso não seja teste, remover da pasta principal
          fs.unlinkSync(newPath(file.storedname))
        }else{//caso contrário, remover da pasta 'uploads-test'
          fs.unlinkSync(newPath(file.storedname, 'uploads-test'))
        }
        
        const filemodel = await File.find(file.id)//buscar model do arquivo
        await filemodel.delete()//deletar no BD
        response.noContent()
      } catch(err) {
        response.badRequest(err)
      }

    }
}

module.exports = FileController
