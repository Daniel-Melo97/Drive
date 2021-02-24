const Helpers = use('Helpers')
const path = use('path')

module.exports = function newPath(newfilename, pasta = 'uploads'){
    return path.join(Helpers.appRoot(pasta),newfilename)
}