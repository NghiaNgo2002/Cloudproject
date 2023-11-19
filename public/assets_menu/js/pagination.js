/**
 * Accepts either a URL or querystring and returns an object associating
 * each querystring parameter to its value.
 *
 * Returns an empty object if no querystring parameters found.
 */
function getUrlParams(urlOrQueryString) {
  if ((i = urlOrQueryString.indexOf("?")) >= 0) {
    const queryString = urlOrQueryString.substring(i + 1);
    if (queryString) {
      return _mapUrlParams(queryString);
    }
  }

  return {};
}

/**
 * Helper function for `getUrlParams()`
 * Builds the querystring parameter to value object map.
 *
 * @param queryString {string} - The full querystring, without the leading '?'.
 */
function _mapUrlParams(queryString) {
  return queryString
    .split("&")
    .map(function (keyValueString) {
      return keyValueString.split("=");
    })
    .reduce(function (urlParams, [key, value]) {
      if (Number.isInteger(parseInt(value)) && parseInt(value) == value) {
        urlParams[key] = parseInt(value);
      } else {
        urlParams[key] = decodeURI(value);
      }
      return urlParams;
    }, {});
}

$(document).ready(function () {
  var data = {
    totalPages: 1,
    nameFilter: "",
    sort: "",
    $curContent: $("#TimKiem-content"),
  };
  $.initData = async function (nameFilter = "", sort = "") {
    let paramName = "&name=" + nameFilter;
    let paramSort = "&sort=" + sort;

    let initReq = await $.get(
      "api/products_menu?page=1" + paramName + paramSort
    );
    console.log(initReq);
    data.totalPages = initReq.pagination_info.total_pages;
    defaultOpts.totalPages = data.totalPages;
  };
  var $pagination = $("#pagination-demo");

  var defaultOpts = {
    totalPages: data.totalPages,
    onPageClick: function (evt, page) {
      $.ajax({
        url: "api/products_menu",
        type: "GET",
        data: {
          page: page,
          name: data.nameFilter,
          sort: data.sort,
        },
        success: function (response) {
          total_pages = response.pagination_info.total_pages;
          data.$curContent.empty();
          $.each(response.products, (i, product) => {
            let content =
              '<div class="col-lg-4 menu-item">' +
              '<a href="products/' +
              product.ID +
              '">' +
              " <div>" +
              "<img " +
              'src="/assets_menu/img/menu/menu-item-' +
              product.ID +
              ".png" +
              '"' +
              ' class="menu-img img-fluid"' +
              ' alt=""' +
              "/>" +
              "</div>" +
              "<div>" +
              "<h4>" +
              product.NAME +
              "</h4>" +
              '<p class="price">' +
              product.PRICE +
              "VNĐ" +
              "</p>" +
              "</div>" +
              "</a>" +
              "</div>";
            data.$curContent.append(content);
          });
        },
      });
    },
  };
  $.initData().then(function () {
    $pagination.twbsPagination(defaultOpts);
  });
  $("#search-bar-form").submit(function (evt) {
    evt.preventDefault();
    data.nameFilter = $("#search-bar-form").serializeArray()[0].value;
    data.sort = "";
    data.$curContent = $("#TimKiem-content");
    $("#tim-kiem-nav").tab("show");
    $.initData(data.nameFilter, data.sort).then(function () {
      if ($pagination.data("twbs-pagination"))
        $pagination.twbsPagination("destroy");
      $pagination.twbsPagination(defaultOpts);
    });
  });
  $("#priceLow").click(function () {
    data.sort = "low";
    $pagination.twbsPagination("destroy");
    $pagination.twbsPagination(defaultOpts);
  });
  $("#priceHigh").click(function () {
    data.sort = "high";
    $pagination.twbsPagination("destroy");
    $pagination.twbsPagination(defaultOpts);
  });

  $("#tim-kiem-nav").click(function () {
    data.$curContent = $("#TimKiem-content");
    data.nameFilter = "";
    data.sort = "";
    $.initData(data.nameFilter, data.sort).then(function () {
      $pagination.twbsPagination("destroy");
      $pagination.twbsPagination(defaultOpts);
    });
  });

  $("#com-nav").click(function () {
    data.$curContent = $("#Com-content");
    data.nameFilter = "Cơm";
    data.sort = "";
    $.initData(data.nameFilter, data.sort).then(function () {
      $pagination.twbsPagination("destroy");
      $pagination.twbsPagination(defaultOpts);
    });
  });

  $("#mi-nav").click(function () {
    data.$curContent = $("#Mi-content");
    data.nameFilter = "Mì";
    data.sort = "";
    $.initData(data.nameFilter, data.sort).then(function () {
      $pagination.twbsPagination("destroy");
      $pagination.twbsPagination(defaultOpts);
    });
  });

  $("#nuoc-nav").click(function () {
    data.$curContent = $("#Nuoc-content");
    data.nameFilter = "Nước";
    data.sort = "";
    $.initData(data.nameFilter, data.sort).then(function () {
      $pagination.twbsPagination("destroy");
      $pagination.twbsPagination(defaultOpts);
    });
  });

  $("#khac-nav").click(function () {
    data.$curContent = $("#Khac-content");
    data.nameFilter = "Khác";
    data.sort = "";
    $.initData(data.nameFilter, data.sort).then(function () {
      $pagination.twbsPagination("destroy");
      $pagination.twbsPagination(defaultOpts);
    });
  });
  $("#req-budget-alert").hide();
  $("#confirm-req-budget").click(function showAlert() {
    $("#req-budget-alert")
      .fadeTo(2000, 500)
      .slideUp(500, function () {
        $("#req-budget-alert").slideUp(500);
      });
  });
});

function confirmAddBudget() {
  let amount = parseInt($("#add-amount").val());
  if (amount != 0) {
    let addAmount = {
      addBudget: amount,
    };
    $.post("/user/api/cart/reqBudget", addAmount);
    $("#cancel-add-budget").click();
  } else {
    $("#cancel-add-budget").click();
  }
}

function confirmAddBudgetOnline() {
  let amount = parseFloat($("#add-amount0").val());
  if (amount !== 0) {
    amount *= 0.000042;
    amount = Math.round(amount * 100) / 100;
    let addAmount = {
      addBudget: amount,
    };
    $.post("/user/paypal", addAmount);
    window.location.href = "/user/paypal";
    $("#cancel-add-budget0").click();
  } else {
    $("#cancel-add-budget0").click();
  }
}
