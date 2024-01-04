$(document).ready(function () {
  
  // 监听按钮点击事件
  $("#sendBtn").click(function (e) {
    e.preventDefault(); // 阻止按钮默认行为

    // 获取输入框的值
    const name = $("#name_input").val();
    const phone = $("#phone_input").val();
    const email = $("#email_input").val();
    const message = $("#message_input").val();

    // 验证输入的电子邮件地址是否有效
    // if (!isValidEmail(email)) {
    //   alert("请输入有效的电子邮件地址");
    //   return; // 如果输入的电子邮件地址无效，不执行后续的代码
    // }

    // 发送POST请求到后端API
    $.ajax({
      type: "POST",
      url: "/contact", // 替换成您的后端API URL
      data: { name: name, phone: phone, email: email, message: message },
      success: function (response) {
        // 请求成功后的操作
        alert("訂閱成功！");
        console.log(response);
      },
      error: function (error) {
        // 请求失败后的操作
        alert("訂閱失敗，請重試。");
        console.error(error);
      },
    });
  });

  // 阻止表单默认提交行为
//   $("#sendBtn").submit(function (e) {
//     e.preventDefault(); // 阻止表单提交
//   });

  // 验证电子邮件地址是否有效的函数
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
});
