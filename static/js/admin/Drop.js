class Drop{
    constructor(){
        this.create()
    }

    create(){
        this.addListeners()
    }

    addListeners(){
        $('html').on('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();

            $('#drop').text('Drop HERE')
        })     

        $('html').on('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();

            $('#drop').text('Drag to upload')
        })
        
        $('#drop').on('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();

            $('#drop').text('DROP')
        })                
        
        $('#drop').on('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();

            $('#drop').text('Drop HERE')
        })           
        
        $('#drop').on('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();

            $('#drop').text('Drop HERE')
        })   

        
        $('#drop').on('drop', function (e) {
            e.stopPropagation();
            e.preventDefault();
        
            let files = e.originalEvent.dataTransfer.files;
            let form = new FormData()

            for(let i of files)
                form.append('file', i)


            $.ajax({
                url: "/upload",
                data: form,
                type: "POST",
                processData: false,
                contentType: false,
                cache: false,
    
                success: (res) => {
                    console.log('success')
                    alert('Zapisano w: ' + JSON.parse(res))
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                }
            })        
        });
    }
}





















drop = null

$(document).ready(() => {
    drop = new Drop  
});