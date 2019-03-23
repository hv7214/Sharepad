window.onload = {
  
  var editor = document.getElementById('pad');
  var docname = document.location.pathname.substring(5);

  sharejs.open(docname, 'text', function(err, doc) {
    doc.attach_textarea(editor);
  });

}
