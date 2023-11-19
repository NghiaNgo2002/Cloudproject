$("input").change(function(e) {

    for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {

        var file = e.originalEvent.srcElement.files[i];

        var img = document.createElement("img");
        img.setAttribute('id', 'upload-image');
        img.setAttribute('width', '50%');
        img.setAttribute('height', '50%');
        var reader = new FileReader();
        reader.onloadend = function() {
            img.src = reader.result;
        }
        reader.readAsDataURL(file);

        $("input").after(img);
    }
    $("#image").hide();

});