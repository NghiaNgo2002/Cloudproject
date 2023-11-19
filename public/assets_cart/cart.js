$(document).ready(function () {
  (function () {
    $.get("/user/api/cart").then(function () {
      renderCart();
    });
  })();
});

function renderCart() {
  $.ajax({
    url: "api/cart",
    type: "GET",
    success: function (response) {
      let total = 0;
      $("#cartContent").empty();
      $.each(response.products, (i, product) => {
        let content =
          "<tr>" +
          '<td class="p-4">' +
          '<div class="media align-items-center">' +
          "<img " +
          'src="/assets_menu/img/menu/menu-item-' +
          product.id +
          '.png" ' +
          'class="d-block ui-w-40 ui-bordered mr-4" ' +
          'alt="" ' +
          "/>" +
          '<div class="media-body">' +
          '<a href="#" class="d-block text-dark">' +
          product.name +
          "</a>" +
          "</div>" +
          "</div>" +
          " </td>" +
          '<td id="price-cart-' +
          product.id +
          '" class="text-right font-weight-semibold align-middle p-4">' +
          product.price +
          " </td>" +
          '<td class="align-middle p-4">' +
          ' <input type="text" id="quantity-cart-' +
          product.id +
          '" class="form-control text-center" min=1 step=1 name="cart-item" value="' +
          product.quantity +
          '" onchange="cart_quantity_change(this)" "/>' +
          " </td>" +
          '<td id="total-cart-' +
          product.id +
          '" class="text-right font-weight-semibold align-middle p-4">' +
          product.price * product.quantity +
          "</td>" +
          ' <td class="text-center align-middle px-0">' +
          '<a id="remove-cart-' +
          product.id +
          '" onclick="removeCart(this)" ' +
          ' class="shop-tooltip close float-none text-danger" ' +
          'title="" ' +
          ' data-original-title="Remove" ' +
          ">" +
          "×" +
          "  </a>" +
          "</td>" +
          "</tr>";
        $("#cartContent").append(content);
        total += product.price * product.quantity;
      });
      $("#total").empty();
      $("#total").append(total);
    },
  });
}

function cart_quantity_change(data) {
  let id = data.getAttribute("id").split("-").pop();
  // let oldVal = parseInt(data.getAttribute("value"));
  let newVal = data.value;
  // data.setAttribute("value", newVal);
  // let priceName = "price-cart-" + id;
  // let price = parseInt(document.getElementById(priceName).innerText);
  // let quantity_total = "total-cart-" + id;
  // document.getElementById(quantity_total).innerText = newVal * price;
  // let total = parseInt(document.getElementById("total").innerText);
  // document.getElementById("total").innerHTML =
  // total - price * oldVal + price * newVal;

  let productID = parseInt(id);
  let cart_detail = {
    productID: productID,
    quantity: newVal,
  };
  $.post("/user/api/cart/edit", cart_detail).then(function () {
    renderCart();
  });
}

function removeCart(data) {
  let id = data.getAttribute("id").split("-").pop();
  let productID = parseInt(id);
  let data_remove = {
    productID: productID,
  };
  $.post("/user/api/cart/remove", data_remove).then(function () {
    renderCart();
  });
}

function checkOut() {
  let total = parseInt(document.getElementById("total").innerText);
  if (total == 0) {
    $("#notyet-check-out").show();
    $("#success-check-out").hide();
    $("#fail-check-out").hide();

    return;
  }
  const note = $("#note-cart").val();
  $.get("/user/api/cart/getBudget", function (data) {
    if (data.BUDGET >= total) {
      data.BUDGET -= total;
      let cart_checkout = {
        remainBudget: data.BUDGET,
        userID: data.ID,
        note: note,
      };
      $.post("/user/api/cart/checkOut", cart_checkout).then(function () {
        $.get("/user/profile/reload").then(function () {
          $.get("/user/api/cart/removeAll").then(function () {
            renderCart();
          });
          document.getElementById("note-cart").value = "";
          $("#notyet-check-out").hide();
          $("#success-check-out").show();
          $("#fail-check-out").hide();
          $("#budget-ui").text(cart_checkout.remainBudget);
        });
      });
    } else {
      $("#notyet-check-out").hide();
      $("#success-check-out").hide();
      $("#fail-check-out").show();
    }
  });
}
