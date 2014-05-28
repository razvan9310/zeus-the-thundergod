var ImageCreator = function() {
    this.createImage = function(id_attr, class_attr, src_attr, alt_attr) {
        var image = $('<img src="' + src_attr + '" alt="' + alt_attr + '">');
        if (id_attr != null) {
            image.attr("id", id_attr);
        }
        if (class_attr != null) {
            image.attr("class", class_attr);
        }
        return image;
    }
}