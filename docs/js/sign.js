$(document).ready(function () {

    $("body").on("click", "#id_btn_signup", function () {
        // alert("submitBtn");
        var username = $("#id_username").val();
        var password = $("#id_password").val();
        var name = $("#id_name").val();
        var phone = $("#id_phone").val();
        var email = $("#id_email").val();
        var address = $("#id_address").val();

        axios
          .post("/users", {
            username: username,
            password: password,
            name: name,
            phone: phone,
            email: email,
            address: address,
          })
          .then(function (response) {
            // 请求成功后的操作
            alert("註冊成功！");
            console.log(response);
          })
          .catch(function (error) {
            // 请求失败后的操作
            alert("註冊失败，请重试。");
            console.error(error);
          });

      });
});
