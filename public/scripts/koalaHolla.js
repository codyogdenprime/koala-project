console.log( 'js' );

var transferSelect = function( transfer_status ) {

  var select = $("<select />");
  
console.log( transfer_status );

  var falseOpt = $("<option>false</option>");
  var trueOpt = $("<option>true</option>");

  if( transfer_status === "true" ) {
    trueOpt.attr("selected", "true");
  } else {
    falseOpt.attr("selected", "true");
  }

  console.log( "opt true", trueOpt );

  select.append( trueOpt );
  select.append( falseOpt );

  console.log( select );

  return select;

};

var changeit = function() {

  var kId = $( this ).data("koala-id");

  var koala = {
    id: kId,
    name: $("#koala-" + kId + "-name").val(),
    age: $("#koala-" + kId + "-age").val(),
    sex: $("#koala-" + kId + "-sex").val(),
    readyForTransfer: $("#koala-" + kId + "-transferStatus").val(),
    notes: $("#koala-" + kId + "-notes").val()
  };

  editKoala( koala );

};

var displayKoalas = function( data ) {

  var container = $("<div />", { class: 'container-koalas' });

  for( var i = 0; i < data.length; i++ ) {

    var wrapper = $("<div />", {class:'koala-wrapper'}).data("id", data[i].id );

    var name = $('<input type="text" />', {class:'koala-name'} ).val( data[i].name );
        name.on('change', changeit);
        name.attr("id","koala-" + data[i].id + "-name");
        name.data('koala-id', data[i].id );
    var age = $('<input type="text" />', {class:'koala-age'}).val( data[i].age );
        age.on('change', changeit);
        age.attr("id","koala-" + data[i].id + "-age");
        age.data('koala-id', data[i].id );
    var sex = $('<input type="text" />', {class:'koala-sex'}).val( data[i].sex );
        sex.on('change', changeit);
        sex.data('koala-id', data[i].id );
        sex.attr("id","koala-" + data[i].id + "-sex");
    var transfer_status = transferSelect( data[i].transfer_status );
        transfer_status.on('change', changeit);
        transfer_status.data('koala-id', data[i].id );
        transfer_status.attr("id","koala-" + data[i].id + "-transferStatus");
    var notes = $('<input type="text" />', {class:'koala-notes'}).val( data[i].notes );
        notes.on('change', changeit);
        notes.attr("id","koala-" + data[i].id + "-notes");
        notes.data('koala-id', data[i].id );

    wrapper.append( name ).append( age ).append( sex ).append( transfer_status ).append( notes );

    container.append( wrapper );

  }

  $("#koala-output").empty().append( container );

};

$( document ).ready( function(){
  console.log( 'JQ' );
  // load existing koalas on page load
  getKoalas();


  // add koala button click
  $( '#addButton' ).on( 'click', function(){
    console.log( 'in addButton on click' );
    // get user input and put in an object
    // NOT WORKING YET :(
    // using a test object
    var objectToSend = {
      name: $('#nameIn').val(),
      age: $('#ageIn').val(),
      sex: $('#sexIn').val(),
      readyForTransfer: $('#transferIn').val(),
      notes: $('#notesIn').val(),
    };
    // call saveKoala with the new obejct
    saveKoala( objectToSend );
  }); //end addButton on click

  $( '#editButton' ).on( 'click', function(){
    console.log( 'in addButton on click' );
    // get user input and put in an object
    // NOT WORKING YET :(
    // using a test object
    var objectToSend = {
      id: $('#idEditIn').val(),
      name: $('#nameEditIn').val(),
      age: $('#ageEditIn').val(),
      sex: $('#sexEditIn').val(),
      readyForTransfer: $('#transferEditIn').val(),
      notes: $('#notesEditIn').val(),
    };
    // call saveKoala with the new obejct
    saveKoala( objectToSend );
  }); //end addButton on click
}); // end doc ready

var getKoalas = function(){
  console.log( 'in getKoalas' );
  // ajax call to server to get koalas
  $.ajax({
    url: '/getKoalas',
    type: 'GET',
    success: function( data ){
      console.log( 'got some koalas: ', data );
      displayKoalas( data );
    } // end success
  }); //end ajax
  // display on DOM with buttons that allow edit of each

}; // end getKoalas

var saveKoala = function( newKoala ){
  console.log( 'in saveKoala', newKoala );
  // ajax call to server to get koalas
  $.ajax({
    url: '/addKoala',
    type: 'post',
    data: newKoala,
    success: function( data ){
      console.log( 'got some koalas: ', data );
      getKoalas();
    } // end success
  }); //end ajax
};

var editKoala = function( newKoala ){
  console.log( 'in saveKoala', newKoala );
  // ajax call to server to get koalas
  $.ajax({
    url: '/editKoala',
    type: 'put',
    data: newKoala,
    success: function( data ){
      console.log( 'got some koalas: ', data );
      getKoalas();
    } // end success
  }); //end ajax
};
