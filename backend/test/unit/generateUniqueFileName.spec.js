const generateUniqueFileName = use('App/utils/generateUniqueFileName')

const { test } = use('Test/Suite')('Generate Unique Filename')

test('Verifica se está gerando o nome do arquivo corretamente', async ({ assert }) => {
  const unique_filename = generateUniqueFileName('teste.pdf')
  
  assert.exists(unique_filename)
  assert.isString(unique_filename)

  const another_filename = generateUniqueFileName('teste.pdf')
  
  assert.notEqual(unique_filename,another_filename)
}) 

