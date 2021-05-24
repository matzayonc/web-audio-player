let Datastore = require('nedb')

let data = new Datastore({
    filename: 'playlist.db',
    autoload: true
});


let obj = {
    add: function (record) {
        console.log(record)
        data.insert(record)
    },

    get: function () {

        return new Promise(resolve => {
            let context = []
            data.find({}, function (err, docs) {
                for (let i of docs){
                    delete i._id
                    context.push(i)
                }
    
                resolve(context)
            })
        })
    },

    remove: function(obj){
        data.remove( obj, { multi: true }, function (err, numRemoved) {
            console.log(numRemoved)
          });
    }
}

module.exports = obj