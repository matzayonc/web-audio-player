class Main {
    constructor() {
        this.net = new Net
        this.ui = new Ui
        this.music = new Music

        this.data = null
        this.currentAlbum = 0
    }

    init() {
        this.net.askForDir()
    }
}

$(document).ready(() => {

    main = new Main()
    main.init()

    //main.net.askForPlaylist()
});