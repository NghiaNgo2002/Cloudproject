$(document).ready(function(){
    function fetchorders(page, size, search, category){
        let pageNumber = (typeof page !== 'undefined') ?  page : 0;
        let sizeNumber = (typeof size !== 'undefined') ?  size : 5;
        let searched = (typeof search !== 'undefined') ? search : -1;
        let selectedcategory = (typeof category !== 'undefined') ?  category : -1;

        /**
         * Do a fetching to get data from Backend's RESTAPI
         */
        $.ajax({
            type : "POST",
            url : "/admin/api/list_orders",
            data: {
                page: pageNumber,
                size: sizeNumber,
                search: searched,
                category: selectedcategory,
            },
            success: function(response){
                $('#ordersTable tbody').empty();
                $.each(response.orders, (i, order) => {
                    let check = null;
                    if(order.STATUS == "Done" || order.STATUS == "Cancel")
                    {
                        check = '<i class="fa fa-check" style="color:green;" aria-hidden="true"></i>';
                    }
                    else check = '<i class="fa fa-times" style="color:red;" aria-hidden="true"></i>';

                    let tmp = order.TIME.split("-");
                    let dd = tmp[2].split("T");
                    let date = (parseInt(dd[0]) + 1) + "-" + tmp[1] + "-" + tmp[0];

                    let orderRow = '<tr>' +
                        '<td>' + order.IDBILL + '</td>' +
                        '<td>' + order.PHONENUMBER + '</td>' +
                        '<td>' + date + '</td>' +
                        '<td>' + check + '</td>' +
                        '<td class="text-right">' + '<a class="btn btn-sm btn-dark" href="/admin/edit_orders/' + order.IDBILL +
                        '" role="button" title="Edit orders">' +
                        ' <i class="fas fa-user-cog"></i>' +
                        '</a>' + '</td>' +
                        '</tr>';
                    $('#ordersTable tbody').append(orderRow);
                });


                if ($('ul.pagination li').length - 4 != response.totalPages){
                    // build pagination list at the first time loading
                    $('ul.pagination').empty();
                    buildPagination(response.totalPages);
                }
            },
            error : function(e) {
                alert("ERROR: ", e);
                console.log("ERROR: ", e);
            }
        });
    }

    /**
     * Search
     */
    $(document).on("click", "#searchButton", function (){
        let category = '-1';
        let search = $("#search").val();

        category = $("#selected_form").val();

        // re-fetch customer list again
        fetchorders(0, 5, search, category);
    });
    /**
     * Select a category for pagination & filtering
     */
    $("select").change(function() {
        let category = '-1';
        let search = null;

        category = this.value;

        // re-fetch customer list again
        fetchorders(0, 5, search, category);
    });


    /**
     *
     * Build the pagination from totalPages
     */
    function buildPagination(totalPages){
        // Build paging navigation
        let firstPage = '<li class="page-item"><a class="page-link">First</a></li>';
        let pageIndex = '<li class="page-item"><a class="page-link">Previous</a></li>';
        $("ul.pagination").append(firstPage);
        $("ul.pagination").append(pageIndex);

        // create pagination
        for(let i=1; i <= totalPages; i++){
            // adding .active class on the first pageIndex for the loading time
            if(i==1){

                pageIndex = "<li class='page-item active' id='first-page'><a class='page-link'>"
                    + i + "</a></li>"
            } else if(i==totalPages) {
                pageIndex = "<li class='page-item' id='last-page'><a class='page-link'>"
                    + i + "</a></li>"
            }else{
                pageIndex = "<li class='page-item'><a class='page-link'>"
                    + i + "</a></li>"
            }
            $("ul.pagination").append(pageIndex);
        }
        let lastPage = '<li class="page-item last"><a class="page-link">Last</a></li>';
        pageIndex = '<li class="page-item"><a class="page-link">Next</a></li>';
        $("ul.pagination").append(pageIndex);
        $("ul.pagination").append(lastPage);
    }

    /**
     * Get the selectedCategory for filtering
     */
    function getSeletedCategory(){
        return $("select").val();
    }

    /**
     *
     * Fetching the orders from SpringBoot RestAPI at the initial time
     */
    (function(){
        // get first-page at initial time
        fetchorders(0);
    })();

    /**
     * Fetch again the customer's data from RestAPI when
     * 		having any click on pagination bar for pagination filtering and sorting
     */
    $(document).on("click", "ul.pagination li a", function() {
        let selectedCategory = getSeletedCategory();
        let search = $("#search").val();

        let val = $(this).text();

        // click on the NEXT tag
        if(val.toUpperCase()==="NEXT"){
            let activeValue = parseInt($("ul.pagination li.active").text());
            let totalPages = $("ul.pagination li").length - 4; // -4 beacause 1 for Previous and 1 for Next
            if(activeValue < totalPages){
                let currentActive = $("li.active");
                fetchorders(activeValue, 5, search, selectedCategory); // get next page value
                // remove .active class for the old li tag
                $("li.active").removeClass("active");
                // add .active to next-pagination li
                currentActive.next().addClass("active");
            }
        } else if(val.toUpperCase()==="PREVIOUS"){
            let activeValue = parseInt($("ul.pagination li.active").text());
            if(activeValue > 1){
                // get the previous page
                fetchorders(activeValue-2, 5, search, selectedCategory);
                let currentActive = $("li.active");
                currentActive.removeClass("active");
                // add .active to previous-pagination li
                currentActive.prev().addClass("active");
            }
        } else if(val.toUpperCase()==="FIRST") {
            fetchorders(0, 5, search,  selectedCategory);
            $("li.active").removeClass("active");
            $(".carousel-inner .carousel-item:first-child").addClass("active");
            $("#first-page").addClass("active");
        } else if(val.toUpperCase()==="LAST") {
            let page = $("ul.pagination li").length -4;
            fetchorders(page -1, 5, search,  selectedCategory);
            $("li.active").removeClass("active");
            $(".carousel-inner .carousel-item:last-child").addClass("active");
            $("#last-page").addClass("active");

        }
        else {
            fetchorders(parseInt(val) - 1, 5, search,  selectedCategory);
            // add focus to the li tag
            $("li.active").removeClass("active");
            $(this).parent().addClass("active");
        }
    });

});


