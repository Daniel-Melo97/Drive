'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')


Route.get('/','UserController.getUsers')

Route.post('/users', 'UserController.create')
Route.post('/login', 'UserController.login')

Route.get('/display/:id', 'FileController.displayFile')

Route.group(() => {
  Route.put('/users','userController.updateUser')
  Route.post('/file', 'FileController.uploadFile')
  
  Route.get('/file', 'FileController.verifyFileExistence')

  Route.put('/file', 'FileController.updateFile')
  Route.put('/rename', 'FileController.renameFile')

  Route.delete('/file', 'FileController.removeFile')
  Route.delete('/users', 'userController.deleteUser')

}).middleware("auth")

