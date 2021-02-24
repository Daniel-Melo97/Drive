const format = use('date-fns/format')

module.exports = function uniqueFileName(filename){
    return  format(new Date(), 'SSSssmmHHdyyyy') + filename
}

