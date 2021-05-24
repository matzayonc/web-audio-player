class Ui {

    constructor() {
        console.log("konstruktor klasy Ui")
        this.clicks()

        this.songList = $('#songs')
        this.debug = false
    }

    showBar(){
        $('#bar').css('display', 'block')

        $("#audio").on("timeupdate", function () {
            let curr = parseInt(main.music.audio.prop("currentTime"))
            let elap = parseInt(main.music.audio.prop("duration"))

            $('#played').css('width', curr/elap*parseInt($('#bar').css('width'))+'px')
        })

        $('#bar').on('mouseup', function(e){
            let where = (e.clientX - $(this).offset().left)/parseInt($(this).width())
            $("#audio").prop("currentTime", where*$("#audio").prop('duration'))
        })

    }


    displayControls() {
        $("#controls").empty()

        let controls = $('#controls')

        let start = $("<div class='control'></div>")
        start.text("Play")
        start.on("click", function () {
            if ($(this).text() == 'Play') {
                main.music.play()
                $(this).text('Pause');
            }
            else {
                main.music.pause()
                $(this).text('Play');
            }
        })
        start.appendTo(controls)
        this.start = start


        let next = $("<div class='control'></div>")
        next.text("Next")
        next.on("click", () => { main.music.next() })
        next.appendTo(controls)

        let prev = $("<div class='control'></div>")
        prev.text("Previous")
        prev.on("click", () => { main.music.prev() })
        prev.appendTo(controls)

        let repeat = $("<div class='control'></div>")
        repeat.text("Repeat")
        repeat.on("click", function() {
            main.ui.toggleControlMark(main.music.repeating, this)
            $(this).next().css('background-color', 'rgba(0, 0, 0, 0)')
            main.music.looping = false
            main.music.repeating = !main.music.repeating
        })
        repeat.appendTo(controls)

        let loop = $("<div class='control'></div>")
        loop.text("Loop")
        loop.on("click", function() {
            main.ui.toggleControlMark(main.music.looping, this)
            $(this).prev().css('background-color', 'rgba(0, 0, 0, 0)')

            main.music.repeating = false
            main.music.looping = !main.music.looping
        })        
        loop.appendTo(controls)

        /*let hide = $("<div class='control'></div>")
        hide.text("Show")
        hide.on("click", () => {
            this.debug = !this.debug

            if (this.debug)
                $('#audio').css('display', 'block')
            else
                $('#audio').css('display', 'none')
        })
        hide.appendTo(controls)*/
    }

    toggleControlMark(bool, obj){

        console.log(bool, obj)

        if(!bool)
            $(obj).css('background-color', 'rgb(100, 100, 100)')
        else
            $(obj).css('background-color', 'rgba(0, 0, 0, 0)')
    }

    setSong() {
        $("#current").html('Playing:  <b>' + main.data.songs[main.music.current].name+'</b>')
    }

    clicks() {

        $("#start").on("click", () => {
            console.log("play")
            main.music.play()
        })

        $("#pause").on("click", () => {
            console.log("pause")
            main.music.pause()
        })

        $("#stop").on("click", () => {
            console.log("stop")
            main.music.stop()
        })

        $("#playlist").on("click", function(){
            main.net.askForPlaylist()
        })        
        
        $("#upload").on("click", function(){
            location.href="/admin"
        })
    }


    createUI(playlist = false) {

        $('#covers').empty()
        $('#songs').empty()

        for (let i in main.data.covers) {
            var div = $('<div></div>')
            div.addClass("cover")

            const cov = main.data.covers[i]

            if (cov != "No cover")
                div.css("background-image", "url('" + cov + "')")
            else
                div.css("background-image", "url('/gfx/questionMark.jpg')")


            div.attr("id", i);

            div.on("click", () => {
                main.currentAlbum = i
                main.net.askForDir()
            })

            div.appendTo('#covers')
        }

        for (let i in main.data.songs) {
            this.addSong(i, playlist)
        }

        return div
    }


    addSong(song, playlist) {
        var tr = $('<tr></tr>')
        tr.attr("id", song)

        tr.on("click", function () {
            main.ui.displayControls()
            main.music.setTrack(this.id)
        })

        var album = $('<td></td>')
        var name = $('<td></td>')
        var size = $('<td></td>')
        var add = $('<td></td>')

        album.addClass("album")
        album.text(main.data.songs[song].album)

        name.addClass("name")
        name.text(main.data.songs[song].name)

        size.addClass("size")
        size.text(Math.ceil(main.data.songs[song].size / (1024 * 1024)) + "MB")

        if(playlist == false){
            add.addClass('add')
            add.text('add')
            add.on('click', function () {    
                let req = main.data.songs[$(this).parent().attr('id')]
                main.net.addToPlaylist(req)
            })
        }
        else{
            add.addClass('add')
            add.text('del')
            add.on('click', function () {
    
                let req = main.data.songs[$(this).parent().attr('id')]
                main.net.removeFromPlaylist(req)
            })
        }

        album.appendTo(tr)
        name.appendTo(tr)
        size.appendTo(tr)
        add.appendTo(tr)

        name.addClass("song")

        tr.appendTo(this.songList)
    }

    mark(i) {
        $("tr").css('background-color', 'inherit')
        $("tr:nth-child(" + (parseInt(i) + 1) + ")").css('background-color', 'rgb(33, 35, 161)')
    }

}