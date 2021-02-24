const newpath = use('App/utils/newPath')

const { test } = use('Test/Suite')('Create Path')

test('Verifique se o caminho foi criado corretamente', async ({ assert }) => {
  const caminho_criado = newpath('teste.pdf')
  
  assert.exists(caminho_criado)
  assert.isString(caminho_criado)
})