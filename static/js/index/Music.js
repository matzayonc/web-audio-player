class Music {

    constructor() {
        console.log("konstruktor klasy Music")
        this.current = 0
        this.repeating = false
        this.looping = false
        this.audio = $("#audio")

        this.events()
    }

    events(){
        this.audio.on("play", function(){
            console.log("mp3 gra")
        })        
        
        this.audio.on("loadeddata", function(){
            console.log("mp3 załadowane")
        })
    }

    play(){
        this.audio.trigger('play')
    }
    
    pause(){
        this.audio.trigger('pause')
    }    
    
    stop(){
        this.audio.trigger('stop')
    }

    whenEnded(){
        this.audio.off('ended')
        this.audio.on('ended', () => {
            if(this.repeating)
                this.setTrack(this.current)
            else if(this.looping)
                this.next()
        })
    }

    next(){
        if(this.current < main.data.songs.length - 1)
            this.setTrack(parseInt(this.current)+1)

        else
            this.setTrack(0)
    }

    prev(){
        if(this.current > 0)
            this.setTrack(this.current-1)
        else
            this.setTrack(main.data.songs.length - 1)
    }   

    setTrack(id){
        this.whenEnded()
        this.current = parseInt(id)
        main.ui.mark(id)
        main.ui.setSong()

        this.audio.attr("src", main.data.songs[id].path)
        this.audio.on('loadeddata', () => { 
            main.ui.showBar()
            $(main.ui.start).text('Pause')
            this.play()
        })
    }
}