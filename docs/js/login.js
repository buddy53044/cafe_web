$(document).ready(function () {
    $("body").on("click", "#id_btn_login", function () {
        // alert("submitBtn");
      var username = $("#id_username").val();
      var password = $("#id_password").val();
      console.log(username);
      console.log(password);
  
      axios
        .post("/users/login", {
          username: username,
          password: password,
        })
        .then(function (response) {
          // Login successful
          alert("Login successful!");
        //   console.log(response);
        })
        .catch(function (error) {
          // Login failed
          alert("Login failed. Please try again.");
          console.error(error);
        });
    });
  });
  