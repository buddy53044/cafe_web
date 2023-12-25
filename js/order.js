document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.input-group').forEach(function(group) {
      let minus = group.querySelector('button:first-of-type');
      let plus = group.querySelector('button:last-of-type');
      let input = group.querySelector('input[type="text"]');
  
      minus.addEventListener('click', function() {
        let value = parseInt(input.value, 10);
        value = isNaN(value) ? 0 : value;
        if(value > 0) { // Add this check if you don't want the value to go below 0
          value--;
        }
        input.value = value;
      });
  
      plus.addEventListener('click', function() {
        let value = parseInt(input.value, 10);
        value = isNaN(value) ? 0 : value;
        value++;
        input.value = value;
      });
    });
  });
  