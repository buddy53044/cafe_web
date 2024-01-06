var AllTempCartData;
var userObject;
$(document).ready(function () {

  // 清空现有的 cartContent 内容
  $("#orderContent").empty();
  // 从本地存储中获取值
  // const storedOrderNotes = localStorage.getItem("orderNotes");
  // console.log("storedOrderNotes",storedOrderNotes);
  // // 将值设置到第二个页面的相应元素中
  // document.getElementById("displayOrderNotes").innerText = storedOrderNotes;

  // 发起异步请求
  axios
    .get("/temp_cart")
    .then((response) => {
      const cartData = response.data;
      AllTempCartData = cartData;
      console.log("cartData", AllTempCartData);
      // 更新 My Order 的数量
      const cartCount = cartData.length;
      $("#orderTitle").text(`My Order(${cartCount})`);

      // 根据返回的 cartData 动态生成内容并添加到 cartContent
      cartData.forEach((item) => {
        const cartItemHTML = `
          <div class="row">
            <div class="col-2 pe-0">
              <p>${item.Number}x</p>
            </div>
            <div class="col-8 p-0">
              <p>${item.name}</p>
            </div>
            <div class="col-2 ps-0">
              <p class=" text-end">$${item.total}</p>
            </div>
          </div>
        `;
        // 将生成的 HTML 添加到 cartContent
        $("#orderContent").append(cartItemHTML);
      });

      // 更新 Subtotal
      const subtotal = cartData.reduce((acc, item) => acc + item.total, 0);
      $("#id_subtotal").text(`$${subtotal}`);
    })
    .catch((error) => {
      console.error("Error fetching cart data", error);
    });

  axios
    .get("/temp_note")
    .then((response) => {
      if (response.data && response.data.length > 0 && response.data[0].note) {
        // 更新 My Order 的数量
        $("#input_note").text(response.data[0].note);
      } else {
        // 如果数据无效或不存在，可以选择不执行任何操作或执行其他逻辑
        console.log("No valid data found in the response.");
      }
    })
    .catch((error) => {
      console.error("Error fetching cart data", error);
    });

    axios
    .get("/users/check-login")
    .then((response) => {
      console.log("response.data", response.data);
      // 檢查 loggedIn 是否為 true
      if (response.data.loggedIn) {
        // 直接從響應中訪問使用者數據
        const user = response.data.user;
        // 從用戶對象中提取id和address
        const userId = user._id;
        const userName = user.username;
        const userPhone = user.phone;
        const userEmail = user.email;
        const userAddress = user.address;  
        userObject = {
          userId: userId,
          userName: userName,
          userPhone: userPhone,
          userEmail: userEmail,
          userAddress: userAddress
        };  
        console.log("用戶已登錄。");
        $("#input_name").val(userObject.userName);
        $("#input_phone").val(userObject.userPhone);
        $("#input_address").val(userObject.userAddress);
        $("#input_email").val(userObject.userEmail);
      } else {
        console.log("用戶未登錄。");
        console.log("User:", userObject);

      }
    })
    .catch((error) => {
      console.error("錯誤 check-login", error);
    });
  
  
  

  $("body").on("click", "#id_btn_order", function () {
    // alert("submitBtn");
    var name = $("#input_name").val();
    var phone = $("#input_phone").val();
    var address = $("#input_address").val();
    var email = $("#input_email").val();
    var note = $("#input_note").val();
    var content = AllTempCartData;
    axios
      .post("/order_record", {
        name: name,
        address: address,
        phone: phone,
        email: email,
        note: note,
        content: content,
      })
      .then(function (response) {
        // 请求成功后的操作
        // alert("商品添加成功！");
        console.log(response);
      })
      .catch(function (error) {
        // 请求失败后的操作
        alert("商品添加失败，请重试。");
        console.error(error);
      });



      axios
      .post("/temp_note/clear", {
      })
      .then(function (response) {
        // 请求成功后的操作
        // alert("刪除成功！");
        console.log(response);
      })
      .catch(function (error) {
        // 请求失败后的操作
        alert("刪除失败，请重试。");
        console.error(error);
      });

      axios
      .post("/temp_cart/clear", {
      })
      .then(function (response) {
        // 请求成功后的操作
        // alert("刪除成功！");
        console.log(response);
      })
      .catch(function (error) {
        // 请求失败后的操作
        alert("刪除失败，请重试。");
        console.error(error);
      });

      
  });

  // $("#input_name").val(getCurrentTime());
  // $("#input_phone").val(getCurrentTime());
  // $("#input_address").val(getCurrentTime());
  // $("#input_email").val(getCurrentTime());
  // $('#input_note').val(getCurrentTime());

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const currentTime = `${hours}:${minutes}:${seconds}`;
    return currentTime;
  }
});
