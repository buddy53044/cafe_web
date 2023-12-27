$(document).ready(function() {

  $('.input-group').each(function() {
    let minus = $(this).find('button:first-of-type');
    let plus = $(this).find('button:last-of-type');
    let input = $(this).find('input[type="text"]');

    minus.on('click', function() {
      let value = parseInt(input.val(), 10);
      value = isNaN(value) ? 0 : value;
      if (value > 0) {
        value--;
      }
      input.val(value);
    });

    plus.on('click', function() {
      let value = parseInt(input.val(), 10);
      value = isNaN(value) ? 0 : value;
      value++;
      input.val(value);
    });
  });

  // for modal test show normally
  const myModal = new bootstrap.Modal('#exampleModal');
  myModal.show();

});
