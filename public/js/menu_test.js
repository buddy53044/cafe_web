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
            <div id="${product.name}" class="card shadow-lg d-flex justify-content-center align-items-center bg-light border-0" data-bs-toggle="modal" data-bs-target="#${product.id_spc}">
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
                                  <p class="d-block d-lg-none">${product.description}</p>
                                  <p class="d-none d-lg-block">${product.short_description}</p>
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
                                <button id="${product.id_spc}_btn" type="button" class="btn btn-success btn-green w-100 btn-add-order">Add to my order $${product.price}</button>
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
    console.log("Minus button clicked");
    let value = parseInt($(this).siblings(".btn-value").val(), 10);
    value = isNaN(value) ? 1 : value;
    if (value > 0) {
      value--;
    }
    console.log(`New value: ${value}`);
    $(this).siblings(".btn-value").val(value);
  });

  $("body").on("click", ".btn-plus", function () {
    console.log("Plus button clicked");
    let value = parseInt($(this).siblings(".btn-value").val(), 10);
    value = isNaN(value) ? 0 : value;
    value++;
    console.log(`New value: ${value}`);
    total = value * clickedProductInfo.price;
    $(this).siblings(".btn-value").val(value);
    // $(".btn-add-order").text(`Add to my order $${total}`); // 更新按鈕內容
    $(this).closest(".modal-footer").find(".btn-add-order").text(`Add to my order $${total}`); // 更新按鈕內容
  });

  $("body").on("click", ".btn-add-order", function () {
    console.log("Add to my order button clicked");
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

  // // 為動態生成的元素綁定事件
  // $("body").on("click", "#modal_minus", function () {
  //   console.log("Minus button clicked");
  //   let value = parseInt($("#modal_value").val(), 10);
  //   value = isNaN(value) ? 1 : value;
  //   if (value > 0) {
  //     value--;
  //   }
  //   console.log(`New value: ${value}`);
  //   $("#modal_value").val(value);
  //   // $("#modal_value").text(value);
  //   // 更新網頁上的內容
  //   // updateProductPrice(value);
  // });

  // $("body").on("click", "#modal_plus", function () {
  //   console.log("Plus button clicked");
  //   let value = parseInt($("#modal_value").val(), 10);
  //   value = isNaN(value) ? 0 : value;
  //   value++;
  //   console.log(`New value: ${value}`);
  //   $("#modal_value").val(value);
  //   // $(`#modal_value`).text(`${value}`);

  //   // 更新網頁上的內容
  //   // updateProductPrice(value);
  // });

  // 更新網頁上的商品價格
  // function updateProductPrice(newPrice) {
  //   const productId = $("#modal_minus").closest('.modal').attr('id');
  //   $(`#${productId}`).find('.nopadding').text(`${newPrice}`);
  // }
});
