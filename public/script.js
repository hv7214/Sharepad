window.onload = function() {

  var btn = document.getElementById("btn");
  var pad_name = document.getElementById("pad_name");

  btn.addEventListener('click', function() {
    window.location.href = window.location.href+"pad/" + pad_name.value ;
  });
}
