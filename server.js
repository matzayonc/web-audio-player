var fs = require("fs");
var http = require("http")
var qs = require("querystring")
var formidable = require('formidable')

var db = require(__dirname + "/modules/database.js")

function getExtension(name) {

    var devided = name.split(".")
    return devided[devided.length - 1]
}

function contentType(ext) {
    switch (getExtension(ext)) {
        case "html":
            return 'text/html'
        case "css":
            return 'text/css'
        case "js":
            return 'application/javascript'
        case "jpg":
            return 'image/jpg'
        case "jpeg":
            return 'image/jpeg'
        case "png":
            return 'image/png'
        case "mp3":
            return 'audio/mpeg3'
        case "ico":
            return 'image/x-icon'
        default:
            return ''
    }
}

function getSize(filename) {
    var stats = fs.statSync(filename)
    var fileSizeInBytes = stats["size"]
    return fileSizeInBytes
}

function getDir(which = 0) {

    var dir = {
        dirs: [],
        covers: [],
        songs: []
    }

    return new Promise(resolve => {
        fs.readdir(__dirname + "/static/mp3", function (err, files) {
            if (err) {
                return console.log("error: " + err);
            }
            for (let file of files)
                dir.dirs.push(file)

            let path = __dirname + "/static/mp3/" + dir.dirs[which]

            fs.readdir(path, function (err, files) {
                if (err) {
                    return console.log("error: " + err);
                }
                for (i of files) {
                    const ext = getExtension(i)

                    if (ext == "mp3" || ext == "wav" || ext == "ogg")
                        dir.songs.push({ name: i, size: getSize(path + "/" + i), album: dir.dirs[which] ,path: "/mp3/"+dir.dirs[which]+'/'+i})
                }
                resolve(dir)
            });
        })
    })
}


function getCover(dir) {
    return new Promise(resolve => {

        path = "mp3/" + dir + "/"

        fs.readdir(__dirname + "/static/" + path, function (err, files) {
            if (err) {
                return console.log("error: " + err);
            }

            for (i of files) {
                const ext = getExtension(i)
                if (ext == "png" || ext == "jpg" || ext == "jpeg")
                    resolve(path + i)
            }
            resolve("No cover")
        })
    })
}


async function sendDir(which, res) {

    try {
        dir = await getDir(which)
        for (i of dir.dirs) {
            try {
                let cover = await getCover(i)
                dir.covers.push(cover)

            } catch (err) {
                console.log(err)
            }
        }

    } catch (err) {
        console.log(err)
    }

    res.end(JSON.stringify(dir, null, 4));
}


async function sendPlaylist(res) {

    try {
        dir = await getDir()
        for (i of dir.dirs) {
            try {
                let cover = await getCover(i)
                dir.covers.push(cover)

            } catch (err) {
                console.log(err)
            }
        }

    } catch (err) {
        console.log(err)
    }
    dir.songs = await db.get()
    res.end(JSON.stringify(dir, null, 4));
}


function rename(path, name){
    console.log(path, name)
    let result = path.split('/')
    result[result.length - 1] = name
    result = result.join('/')
    
    fs.renameSync(path, result)
}


var server = http.createServer(function (req, res) {

    switch (req.method) {
        case "GET":
            var url = decodeURI(req.url)

            console.log('URL: '+ url)

            if (url == "/")
                url = "/index.html"            
            else if (url == "/admin")
                url = "/admin.html"

            fs.readFile("static" + url, function (error, data) {

                const type = contentType(getExtension(url))

                if (type == '') {
                    console.log('Nie ma takiej strony')
                    res.writeHead(404)
                    res.end();
                }
                else {
                    res.writeHead(200, { 'Content-Type': type })
                    res.write(data);
                    res.end();
                }
            })

            break;
        case "POST":
            res.writeHead(200, { 'Content-Type': 'text/plain' });

            if(decodeURI(req.url) != '/upload'){
                var data = ""
                req.on("data", function (part) {
                    data += part;
                })
            }

            switch (decodeURI(req.url)) {
                case "/upload":
                    let form = new formidable.IncomingForm()
                    form.multiples = true
                    form.keepExtensions = true

                    var dir = __dirname +'/static/mp3/upload/'

                    console.log(dir)

                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }

                    form.uploadDir = dir
                    form.parse(req, (err, fields, files) => {  
                        
                        if(files.file.length == undefined)
                            rename(files.file.path, files.file.name)
                        else{
                            let allOk = true
                            for(let i of files.file)
                                rename(i.path, i.name)
                        }

                        res.end(JSON.stringify(dir, null, 4))
                        
                    });

                    break;                
                case "/scan":
                    req.on("end", function () {
                        sendDir(qs.decode(data).which, res)
                    })
                    break;
                case '/add':
                    req.on('end', function () {
                        let record = qs.decode(data)
                        console.log(record.x)
                        db.add(record)
                        res.end()

                    })
                case '/get':
                    req.on("end", function () {
                        sendPlaylist(res)
                    })
                    break                
                case '/remove':
                    req.on("end", function () {
                        console.log('removing', qs.decode(data))
                        db.remove(qs.decode(data))
                        res.end()
                    })
                    break
            }
            break;
    }

}).listen(3000, function () {
    console.log("serwer startuje na porcie 3000")
});