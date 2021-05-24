class Net {

    constructor() {
        console.log("konstruktor klasy Net")
    }

    askForDir() {
        $.ajax({
            url: "/scan",
            data: { which: main.currentAlbum },
            type: "POST",

            success: (res) => {
                main.data = JSON.parse(res)
                console.log(JSON.parse(res))
                main.ui.createUI()
            },
            error: function (xhr, status, error) {
                console.log(xhr);
                return -1
            }

        })
    }

    addToPlaylist(obj) {
        $.ajax({
            url: "/add",
            data: obj,
            type: "POST",
            success: (res) => {},
            error: function (xhr, status, error) {
                console.log(xhr);
                return -1
            }
        })
    }    
    
    removeFromPlaylist(obj) {
        $.ajax({
            url: "/remove",
            data: obj,
            type: "POST",

            success: (res) => {
                main.net.askForPlaylist()
            },
            error: function (xhr, status, error) {
                console.log(xhr);
                return -1
            }
        })
    }

    askForPlaylist() {

        $.ajax({
            url: "/get",
            type: "POST",

            success: (res) => {
                main.data = JSON.parse(res)
                console.log(main.data)
                main.ui.createUI(true)
            },
            error: function (xhr, status, error) {
                console.log(xhr);
                return -1
            }

        })
    }

}