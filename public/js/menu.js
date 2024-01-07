let globalproducts;
let clickedProductId;
let clickedProductInfo;

// 使用jQuery的文档准备事件，以确保页面加载完成后执行脚本
$(document).ready(function () {
  // 发送GET请求以获取产品数据
  axios
    .get("/products") // 请替换成您的API端点
    .then(function (response) {
      const products = response.data; // 从响应中获取产品数据
      globalproducts = products;
      console.log("globalproducts", globalproducts);
      console.log(products);
      // 使用对象来分组不同类型的产品
      const groupedProducts = {
        Bakery: [],
        Breakfast: [],
        Drink: [],
      };

      // 遍历产品数据并按类型分组
      products.forEach(function (product) {
        if (groupedProducts.hasOwnProperty(product.type)) {
          groupedProducts[product.type].push(product);
        }
      });

      // 动态生成不同类型的产品到相应的容器
      for (const type in groupedProducts) {
        if (groupedProducts.hasOwnProperty(type)) {
          const containerId = `#${type}Products`;
          // console.log(containerId);
          const productsOfType = groupedProducts[type];

          productsOfType.forEach(function (product) {
            const productCard = `
          <div class="col-12 col-md-6 col-lg-4 g-lg-4">
            <div id="${product.name}" class="card shadow-lg d-flex justify-content-center align-items-center bg-light border-0 cart-hover"  data-bs-toggle="modal" data-bs-target="#${product.id_spc}">
              <img src="img/menu/${product.name}.jpg" class="card-img-top img-fluid menu-img" alt="${product.name}">
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text d-none d-md-block">${product.short_description}</p>
                <p class="nopadding">$${product.price}</p>
              </div>
            </div>
          </div>
        `;

            // 将产品卡片添加到相应的容器中
            $(containerId).append(productCard);
          });
        }
      }

      products.forEach(function (product) {
        // 创建模态框的HTML代码
        const modalHTML = `
                  <div class="modal fade" id="${product.id_spc}" tabindex="-1" aria-labelledby="${product.name}Label" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                      <div class="modal-content">
                        <div class="modal-header border-0">
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <div class="container-fluid">
                            <div class="row">
                              <div class="col-12 col-lg-6 d-block d-lg-none">
                                <h4>${product.name}</h4>
                              </div>
                              <div class="col-12 col-lg-3">
                                <img src="img/menu/${product.name}.jpg" class="card-img" alt="${product.name}">
                              </div>
                              <div class="col-lg-9">
                                <div class="col-12 d-none d-lg-block">
                                  <h4>${product.name}</h4>
                                </div>
                                <div class="col-12">
                                  <p class="d-block d-lg-none">${product.short_description}</p>
                                  <p class="d-none d-lg-block">${product.description}</p>
                                </div>
                              </div>
                            </div>
                            <p>Special Requests</p>
                            <form class="row g-0 pb-2">
                              <div class="col-12 pb-2">
                                <textarea class="form-control px-2 textgrayplaceholder" placeholder="Add them here. We'll do our best to make it happen." rows="2"></textarea>
                              </div>
                            </form>
                          </div>
                        </div>
                        <div class="modal-footer">
                          <div class="container-fluid">
                            <div class="row g-4">
                              <div class="col-12 col-lg-4">
                                <div class="input-group">
                                  <button id="${product.id_spc}_minus" class="btn btn-outline-secondary border-dark btn-minus" type="button">-</button>
                                  <input id="${product.id_spc}_value" type="text" class="form-control text-center border-dark btn-value" value="1">
                                  <button id="${product.id_spc}_plus" class="btn btn-outline-secondary border-dark btn-plus" type="button">+</button>
                                </div>
                              </div>
                              <div class="col-12 col-lg-8">
                                <button id="${product.id_spc}_btn" type="button" class="btn btn-success btn-green w-100 btn-add-order btn_hover_5F695E" data-bs-dismiss="modal" aria-label="Close">Add to my order $${product.price}</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                `;

        // 将模态框的HTML添加到文档的<body>中
        $("body").append(modalHTML);
      });
    })
    .catch(function (error) {
      console.error(error);
    });

  $("body").on("click", ".btn-minus", function () {
    // console.log("Minus button clicked");
    let value = parseInt($(this).siblings(".btn-value").val(), 10);
    value = isNaN(value) ? 1 : value;
    if (value > 1) {
      value--;
    }
    total = value * clickedProductInfo.price;
    // console.log(`New value: ${value}`);
    $(this).siblings(".btn-value").val(value);
    $(this)
      .closest(".modal-footer")
      .find(".btn-add-order")
      .text(`Add to my order $${total}`); // 更新按鈕內容
  });

  $("body").on("click", ".btn-plus", function () {
    // console.log("Plus button clicked");
    let value = parseInt($(this).siblings(".btn-value").val(), 10);
    value = isNaN(value) ? 0 : value;
    value++;
    // console.log(`New value: ${value}`);
    total = value * clickedProductInfo.price;
    $(this).siblings(".btn-value").val(value);
    // $(".btn-add-order").text(`Add to my order $${total}`); // 更新按鈕內容
    $(this)
      .closest(".modal-footer")
      .find(".btn-add-order")
      .text(`Add to my order $${total}`); // 更新按鈕內容
  });

  $("body").on("click", ".btn-add-order", function () {
    const name = clickedProductInfo.name;
    const price = clickedProductInfo.price;
    // $(".cart_span_number").text(AllTempCartData.length);
    const Special_Request = $(this)
      .closest(".modal")
      .find(".modal-body")
      .find(".form-control.px-2.textgrayplaceholder")
      .val();

    // console.log(Special_Request);
    const Number = parseInt(
      $(this).closest(".modal-footer").find(".btn-value").val(),
      10
    );
    const total = Number * price;
    // console.log("Add to my order button clicked");
    // 发送POST请求到后端API post
    axios
      .post("/temp_cart", {
        name: name,
        price: price,
        Special_Request: Special_Request,
        Number: Number,
        total: total,
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
  });

  $("body").on("click", ".card", function () {
    // 當卡片被點擊時，將相應的 product.id_spc 賦值給全局變數
    clickedProductId = $(this).attr("data-bs-target").substring(1);

    clickedProductInfo = getProductDataById(clickedProductId);
    console.log(clickedProductInfo);

    getProductDataById(clickedProductId);
    console.log(clickedProductId);
  });

  function getProductDataById(productId) {
    // 根據 product.id_spc 從全局變數 globalproducts 中獲取產品數據
    const product = globalproducts.find((p) => p.id_spc === productId);

    if (product) {
      return {
        id: product._id,
        id_spc: product.id_spc,
        name: product.name,
        short_description: product.short_description,
        description: product.description,
        type: product.type,
        price: product.price,
      };
    } else {
      console.error("Product not found");
      return null;
    }
  }

  var AllTempCartData;
  var subtotal = 0;
  var updatedTotal;
  $("body").on("click", "#btn_cart", async function () {
    // 清空现有的 cartContent 内容
    $("#cartContent").empty();

    try {
        // 从 temp_cart 获取数据
        const response = await axios.get("/temp_cart");
        const cartData = response.data;
        AllTempCartData = cartData;
        console.log("AllTempCartData", AllTempCartData);
        // 更新 My Order 的数量
        const cartCount = cartData.length;
        $(".modal-title#cartmodallabel").text(`My Order(${cartCount})`);

        var tempProduct_id_spc;
        // 遍历 tempCartData
        cartData.forEach((item) => {
            // 查找匹配的产品
            for (const product of globalproducts) {
                if (product.name === item.name) {
                    // 设置 data-bs-target
                    // const editButton = $(`#${item.id_spc}_edit`);
                    // editButton.attr("data-bs-target", `#${product.id_spc}`);
                    // editButton.attr("data-bs-toggle", "modal");  // 添加这一行
                    tempProduct_id_spc=product.id_spc;
                    break;  // 找到匹配项后，跳出内部循环
                }
            }

            const cartItemHTML = `
                <div class="row py-2 cart_content_item ">
                    <div class="col-3 nopadding d-flex align-content-center ">
                        <div class="input-group align-content-center">
                            <button id="${item.id_spc}_minus" class="btn btn-outline-secondary border-dark px-1 btn_cart_minus" type="button">-</button>
                            <input id="${item.id_spc}_value" type="text" class="form-control text-center border-dark nopadding border-start-0 btn_cart_value" value="${item.Number}">
                            <button id="${item.id_spc}_plus" class="btn btn-outline-secondary border-dark px-1 btn_cart_plus" type="button">+</button>
                        </div>
                    </div>
                    <div class="col-6 ">
                        <div class="row">
                            <div class="col-12 ">
                                <p class="nopadding">${item.name}</p>
                            </div>
                            <div class="col" style="font-size: 14px;">
                                <button id="${item.id_spc}_edit" type="button" class="btn btn-sm btn-outline-dark  btn_edit" data-bs-toggle="modal" data-bs-target="#${tempProduct_id_spc}" data-bs-dismiss="modal" aria-label="Close" style="font-size: 14px;">edit</button>
                            </div>
                            <div class="col" style="font-size: 14px;">
                                <button id="${item.id_spc}_remove" type="button" class="btn btn-sm btn-outline-dark btn_remove" style="font-size: 14px;">Remove</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-3 text-end align-self-center">
                        <p id="${item.id_spc}_total" class="nopadding item_total">$${item.total}</p>
                    </div>
                </div>
            `;
            // 将生成的 HTML 添加到 cartContent
            $("#cartContent").append(cartItemHTML);
        });

        // 更新 Subtotal
        subtotal = cartData.reduce((acc, item) => acc + item.total, 0);
        $("#id_subtotal").text(`$${subtotal}`);
    } catch (error) {
        console.error("Error fetching cart data", error);
    }
});


  $("body").on("click", ".btn_cart_minus", function () {
    console.log("Minus button clicked");
    let value = parseInt($(this).siblings(".btn_cart_value").val(), 10);
    value = isNaN(value) ? 1 : value;
    if (value > 1) {
      value--;
      console.log(`New value: ${value}`);
      $(this).siblings(".btn_cart_value").val(value);

      tempCartData = getTempCartData($(this), "_minus");
      console.log("Temp Cart idspc:", tempCartData);
      const tempTotal = value * tempCartData[0].price;
      subtotal -= tempCartData[0].price;
      $("#id_subtotal").text(`$${subtotal}`);
      console.log("Temp Cart total:", tempTotal);
      console.log("Temp Cart id:", tempCartData[0]._id);
      axios
        .patch(`/temp_cart/${tempCartData[0]._id}`, {
          Number: value,
          total: tempTotal,
        })
        .then(function (response) {
          // 请求成功后的操作
          // alert("商品价格修改成功！");
          console.log(response);

          // 刷新当前页面 畫面會重新載入
          // location.reload();

          // 更新页面上的价格
          updatedTotal = response.data.total;
          $(`#${response.data.id_spc}_total`).text(`$${updatedTotal}`);
        })
        .catch(function (error) {
          // 请求失败后的操作
          alert("modal商品价格修改失败，请重试。");
          console.error(error);
        });
    }
  });
var tempTotal;
  $("body").on("click", ".btn_cart_plus", function () {
    console.log("Plus button clicked");
    value = parseInt($(this).siblings(".btn_cart_value").val(), 10);
    value = isNaN(value) ? 1 : value;
    value++;
    console.log(`New value: ${value}`);
    $(this).siblings(".btn_cart_value").val(value);

    tempCartData = getTempCartData($(this), "_plus");
    console.log("Temp Cart idspc:", tempCartData);
    tempTotal = value * tempCartData[0].price;
    subtotal += tempCartData[0].price;
    $("#id_subtotal").text(`$${subtotal}`);
    console.log("Temp Cart total:", tempTotal);
    console.log("Temp Cart id:", tempCartData[0]._id);
    axios
      .patch(`/temp_cart/${tempCartData[0]._id}`, {
        Number: value,
        total: tempTotal,
      })
      .then(function (response) {
        // 请求成功后的操作
        // alert("商品价格修改成功！");
        console.log(response);

        // 刷新当前页面 畫面會重新載入
        // location.reload();

        // 更新页面上的价格
        updatedTotal = response.data.total;
        $(`#${response.data.id_spc}_total`).text(`$${updatedTotal}`);
      })
      .catch(function (error) {
        // 请求失败后的操作
        alert("modal商品价格修改失败，请重试。");
        console.error(error);
      });
  });

  $("body").on("click", ".btn_remove", async function () {
    console.log("btn_remove clicked");

    tempCartData = getTempCartData($(this), "_remove");
    console.log("Temp Cart idspc:", tempCartData);

    axios
      .delete(`/temp_cart/${tempCartData[0]._id}`)
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

    $("#cartContent").empty();
    try {
      // 从 temp_cart 获取数据
      const response = await axios.get("/temp_cart");
      const cartData = response.data;
      AllTempCartData = cartData;
      // 更新 My Order 的数量
      const cartCount = cartData.length;
      $(".modal-title#cartmodallabel").text(`My Order(${cartCount})`);

      // 根据返回的 cartData 动态生成内容并添加到 cartContent
      cartData.forEach((item) => {
        const cartItemHTML = `
            <div class="row py-2 cart_content_item ">
              <div class="col-3 nopadding d-flex align-content-center ">
                <div class="input-group align-content-center">
                  <button id="${item.id_spc}_minus", class="btn btn-outline-secondary border-dark px-1 btn_cart_minus" type="button">-</button>
                  <input id="${item.id_spc}_value", type="text" class="form-control text-center border-dark nopadding border-start-0 btn_cart_value" value="${item.Number}">
                  <button id="${item.id_spc}_plus", class="btn btn-outline-secondary border-dark px-1 btn_cart_plus" type="button">+</button>
                </div>
              </div>
              <div class="col-6 ">
                <div class="row">
                  <div class="col-12 ">
                    <p class=" nopadding">${item.name}</p>
                  </div>
                  <div class="col" style="font-size: 14px;">
                  <button id="${item.id_spc}_edit" type="button" class="btn btn-sm btn-outline-dark btn_edit"  style="font-size: 14px;">edit</button>
                  </div>
                  <div class="col" style="font-size: 14px;">
                    <button id="${item.id_spc}_remove" type="button" class="btn btn-sm btn-outline-dark btn_remove" style="font-size: 14px;">Remove</button>
                  </div>
                </div>
              </div>
              <div class="col-3 text-end align-self-center">
                <p id="${item.id_spc}_total" class=" nopadding item_total">$${item.total}</p>
              </div>
            </div>
          `;
        // 将生成的 HTML 添加到 cartContent
        $("#cartContent").append(cartItemHTML);
      });

      // 更新 Subtotal
      subtotal = cartData.reduce((acc, item) => acc + item.total, 0);
      // $(".modal-footer .row .col-6.text-end p").text(`$${subtotal}`);
      $("#id_subtotal").text(`$${subtotal}`);
    } catch (error) {
      console.error("Error fetching cart data", error);
    }
  });

  $("body").on("click", ".btn_edit", function () {
    // 當卡片被點擊時，將相應的 product.id_spc 賦值給全局變數
    clickedProductId = $(this).attr("data-bs-target").substring(1);
    clickedProductInfo = getProductDataById(clickedProductId);
    
    console.log(clickedProductInfo);

    getProductDataById(clickedProductId);
    // console.log(clickedProductId);
    // console.log("btn_edit clicked",AllTempCartData);
    var cartData= getTempCartData($(this), "_edit");
    console.log("EditCartData",cartData);


    $(".btn-value").val(value);
    $(".btn-add-order").text(`Add to my order $${tempTotal}`); // 更新按鈕內容
  });

  // 获取与按钮相关的 temp_cart 数据的函数
  function getTempCartData(buttonElement, buttonType) {
    // 示例：获取产品 ID_spc
    const productId = buttonElement.attr("id").replace(`${buttonType}`, "");
    // 示例：根据产品 ID 从 AllTempCartData 中筛选相应的 temp_cart 数据
    const matchingData = AllTempCartData.filter(
      (item) => item.id_spc === productId
    );
    // 返回相应的 temp_cart 数据数组
    return matchingData;
  }

  $("body").on("click", "#id_checkout", function () {
    // alert("Checkout button clicked");
    var note = $("#menu_orderNote").val();
    axios
      .post("/temp_note", {
        note: note,
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
  });

  axios
  .get("/temp_note")
  .then((response) => {
    if (response.data[0].note) {
      // 如果note不为空，执行以下操作
      console.log("response.data", response.data[0].note);
      // 更新 My Order 的数量
      // const cartCount = cartData.length;
      $("#menu_orderNote").text(response.data[0].note);
    } else {
      console.log("Note is empty. No further action.");
    }
  })
  .catch((error) => {
    console.error("Error fetching cart data", error);
  });


  });
  
  // const myModal = new bootstrap.Modal("#cartmodal");
  // myModal.show();

// const cartItemHTML = `
// <div class="row py-2 cart_content_item ">
//   <div class="col-3 nopadding d-flex align-content-center ">
//     <div class="input-group align-content-center">
//       <button id="${item.id_spc}_minus", class="btn btn-outline-secondary border-dark px-1 btn_cart_minus" type="button">-</button>
//       <input id="${item.id_spc}_value", type="text" class="form-control text-center border-dark nopadding border-start-0 btn_cart_value" value="${item.Number}">
//       <button id="${item.id_spc}_plus", class="btn btn-outline-secondary border-dark px-1 btn_cart_plus" type="button">+</button>
//     </div>
//   </div>
//   <div class="col-6 ">
//     <div class="row">
//       <div class="col-12 ">
//         <p class=" nopadding">${item.name}</p>
//       </div>
//       <div class="col" style="font-size: 14px;">
//         <p class="editcolor nopadding">Edit</p>
//       </div>
//       <div class="col" style="font-size: 14px;">
//          <p class="editcolor nopadding">Remove</p>

//       </div>
//     </div>
//   </div>
//   <div class="col-3 text-end align-self-center">
//     <p id="${item.id_spc}_total" class=" nopadding item_total">$${item.total}</p>
//   </div>
// </div>
// `;
