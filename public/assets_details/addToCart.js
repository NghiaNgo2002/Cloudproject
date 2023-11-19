$(document).ready(function () {
  $("#AddToCart").click(async function () {
    const productID = parseInt($("#ID").text());
    const data = {
      productID: productID,
    };
    $.post("/user/api/cart/add", data);
    $("#alert-success").show();
  });
  $("#BuyNow").on("click", async function (e) {
    e.preventDefault();
    const productID = parseInt($("#ID").text());
    const data = {
      productID: productID,
    };
    await $.post("/user/api/cart/add", data);
    window.location.href = "/user/cart";
  });

  (async function () {
    await renderReviewList();
  })();

  $("#sendNewComment").click(async function () {
    const cmt = $("#new-review").val();
    if (cmt == "") {
      $("#notyet-save-review").show();
      $("#success-save-review").hide();
    } else {
      $("#notyet-save-review").hide();
      $("#success-save-review").show();
      const productID = parseInt($("#ID").text());
      const data = {
        comment: cmt,
        productID: productID,
      };
      await $.post("/user/api/review/add", data);
      renderReviewList();
    }
  });
});

function renderReviewList() {
  const productID = parseInt($("#ID").text());
  var data = {
    totalPages: 1,
    productID: productID,
  };
  $.initCart = async function () {
    let initReq = await $.get("/user/api/review?page=1", data);
    data.totalPages = initReq.pagination_info.total_pages;
    defaultOption.totalPages = data.totalPages;
  };

  var $review = $("#pagination-review");

  var defaultOption = {
    totalPages: data.totalPages,
    startPage: 1,
    onPageClick: function (evt, page) {
      $.ajax({
        url: "/user/api/review",
        type: "GET",
        data: {
          page: page,
          productID: data.productID,
        },
        success: function (response) {
          $("#review-content").empty();
          $.each(response.list, (i, comment) => {
            let content =
              '<div class="card">' +
              '<div class="card-body">' +
              '<div class="row">' +
              '<div class="col-md-2">' +
              //  ' <img'+
              //     src="https://image.ibb.co/jw55Ex/def_face.jpg"
              //     class="img img-rounded img-fluid"
              //   />
              '<p class="text-secondary text-center">' +
              comment.TIME +
              "</p>" +
              "</div>" +
              '<div class="col-md-10">' +
              "<p>" +
              "<strong>" +
              comment.FULLNAME +
              "</strong>" +
              '<span class="float-right">' +
              '<i class="text-warning fa fa-star"></i></span>' +
              ' <span class="float-right"><i class="text-warning fa fa-star"></i></span>' +
              '<span class="float-right"><i class="text-warning fa fa-star"></i></span>' +
              '<span class="float-right"><i class="text-warning fa fa-star"></i></span>' +
              "</p>" +
              '<div class="clearfix"></div>' +
              "<p>" +
              comment.COMMENT +
              "</p>" +
              "</div>" +
              "</div>" +
              "</div>" +
              "</div>";
            $("#review-content").append(content);
          });
        },
      });
    },
  };
  $.initCart().then(function () {
    if ($review.data("twbs-pagination")) $review.twbsPagination("destroy");
    $review.twbsPagination(defaultOption);
  });
}
