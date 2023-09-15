$(document).ready(function(){
  $("form#UpdateRegistry").on('submit', function(e){
    e.preventDefault();
    let data = $("form#UpdateRegistry input[type=checkbox]:checked");
    let information = [];
    for (let i = 0; i < data.length; i++){
      information.push(data[i].value);
    }
    console.log(information);
    let compressed = information.join(",");
    $.ajax({
      type: "post",
      url: '/registry/updateRegistry',
      data: {items: compressed},
      success: function(result){
        alert("item has been selected");
      }
    })
  });
});
