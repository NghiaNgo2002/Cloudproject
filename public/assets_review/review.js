$(document).ready(function () {});
function renderReviewList(productID) {
  $.initData = async function () {
    let initReq = await $.get("api/review/" + productID);
    console.log(initReq);
    data.totalPages = initReq.pagination_info.total_pages;
    defaultOpts.totalPages = data.totalPages;
  };
  var $pagination = $("#pagination-review");

  var defaultOpts = {
    totalPages: data.totalPages,
    onPageClick: function (evt, page) {
      $.ajax({
        url: "api/review" + data.productID,
        type: "GET",
        data: {
          page: page,
          productID: data.productID,
        },
        success: function (response) {
          total_pages = response.pagination_info.total_pages;
          $("#review-content").empty();
          $.each(response.products, (i, product) => {
            let content = "a";
            $("#review-content").append(content);
          });
        },
      });
    },
  };
  $.initData().then(function () {
    $pagination.twbsPagination(defaultOpts);
  });
}
