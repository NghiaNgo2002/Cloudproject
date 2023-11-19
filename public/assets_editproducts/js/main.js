$(document).ready(function(){
    function fetchproducts(page, size, search, category, namesorting, pricesorting, desc){
        let pageNumber = (typeof page !== 'undefined') ?  page : 0;
        let sizeNumber = (typeof size !== 'undefined') ?  size : 5;
        let searched = (typeof search !== 'undefined') ? search : -1;
        let selectedcategory = (typeof category !== 'undefined') ?  category : -1;
        let nameSorted = (typeof namesorting !== 'undefined') ?  namesorting: false;
        let priceSorted = (typeof pricesorting !== 'undefined') ?  pricesorting: false;
        let descDirection = (typeof desc !== 'undefined') ?  desc: false;

        /**
         * Do a fetching to get data from Backend's RESTAPI
         */
        $.ajax({
            type : "POST",
            url : "/admin/api/edit_products",
            data: {
                page: pageNumber,
                size: sizeNumber,
                search: searched,
                category: selectedcategory,
                namesorting: nameSorted,
                pricesorting: priceSorted,
                desc: descDirection
            },
            success: function(response){
                $('#productsTable tbody').empty();
                $.each(response.products, (i, product) => {
                    let tr_id = 'tr_' + product.id;
                    let productRow = '<tr>' +
                        '<td>' + product.ID + '</td>' +
                        '<td>' + product.NAME + '</td>' +
                        '<td>' + '<img src="/assets_menu/img/menu/' + product.IMAGE + '"width="200" height="100"</td>' +
                        '<td>' + product.PRICE + '</td>' +
                        '<td class="text-right">' + '<a class="btn btn-sm btn-dark" href="/admin/edit_products/' + product.ID +
                        '" role="button" title="Edit products">' +
                        ' <i class="fas fa-user-cog"></i>' +
                        '</a>' + '</td>' +
                        '</tr>';
                    $('#productsTable tbody').append(productRow);
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
    $("#search").keyup(function (){
        let category = '-1';

        let search = this.value;

        let namesorting = false;
        let pricesorting = false;
        let desc = false;

        category = $("#selected_form").val();

        if($("#name_sorting"). prop("checked") == true){
            namesorting = true;
        }

        if($("#price_sorting"). prop("checked") == true){
            pricesorting = true;
        }

        if($("#desc_sorting"). prop("checked") == true){
            desc = true;
        }

        // re-fetch customer list again
        fetchproducts(0, 5, search, category, namesorting, pricesorting, desc);
    });
    /**
     * Select a category for pagination & filtering
     */
    $("select").change(function() {
        let category = '-1';
        let search = null;

        category = this.value;


        let namesorting = false;
        let pricesorting = false;
        let desc = false;

        if($("#name_sorting"). prop("checked") === true){
            namesorting = true;
        }

        if($("#price_sorting"). prop("checked") === true){
            pricesorting = true;
        }

        if($("#desc_sorting"). prop("checked") === true){
            desc = true;
        }

        // re-fetch list again
        fetchproducts(0, 5, search, category, namesorting, pricesorting, desc);
    });

    /**
     * Get a list of category
     */
    function getListCategory(){
        $.ajax({
            type : "POST",
            url : "/admin/api/edit_products/category",
            success: function(response){
                $("#selected_form").empty();
                $('#selected_form').append("<option>All</option>");
                $.each(response.sort().reverse(), (i, category) => {
                    // <option>All</option>
                    let optionElement = "<option>" + category + "</option>";
                    $('#selected_form').append(optionElement);
                });
            },
            error : function(e) {
                alert("ERROR: ", e);
                console.log("ERROR: ", e);
            }
        });
    }

    /**
     * name_sorting checkbox is changed
     */
    $('#name_sorting').on('change', function() {
        if(this.checked){
            $("#desc_sorting").removeAttr("disabled");
            $("#sortingbtn").removeAttr("disabled");
        }else {
            $("#desc_sorting").attr("disabled", true);
            $("#desc_sorting").prop("checked", false);
            $("#sortingbtn").attr("disabled", true);
        }
    });

    $('#price_sorting').on('change', function() {
        if(this.checked){
            $("#desc_sorting").removeAttr("disabled");
            $("#sortingbtn").removeAttr("disabled");
        }else {
            $("#desc_sorting").attr("disabled", true);
            $("#desc_sorting").prop("checked", false);
            $("#sortingbtn").attr("disabled", true);
        }
    });
    /**
     * Click on sorting Button
     */
    $(document).on("click", "#sortingbtn", function() {
        let namesorting = false;
        let pricesorting = false;
        let desc = false;
        let selectedCategory = getSeletedCategory();
        let search = $("#search").val();
        //get value of check boxes

        /* namesorting checkbox */
        if($("#name_sorting"). prop("checked") === true){
            namesorting = true;
        }

        if($("#price_sorting"). prop("checked") === true){
            pricesorting = true;
        }

        /* desc checkbox */
        if($("#desc_sorting"). prop("checked") === true){
            desc = true;
        }

        // get the active index of pagination bar
        let selectedPageIndex = parseInt($("ul.pagination li.active").text()) - 1;

        // just fetch again products from SpringBoot RestAPIs when sorting checkbox is checked
        if(namesorting){
            fetchproducts(selectedPageIndex, 5, search, selectedCategory, namesorting, pricesorting, desc); // get next page value
        }
        if(pricesorting){
            fetchproducts(selectedPageIndex, 5, search, selectedCategory, namesorting, pricesorting, desc); // get next page value
        }
    });

    /**
     *
     * Build the pagination Bar from totalPages
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
     * Get the selectedSalary for filtering
     */
    function getSeletedCategory(){
        return $("select").val();
    }

    /**
     *
     * Fetching the products from SpringBoot RestAPI at the initial time
     */
    (function(){
        // get first-page at initial time
        fetchproducts(0);

        // get the distinct values of customer's salaries
        getListCategory();
    })();

    /**
     * Fetch again the customer's data from RestAPI when
     * 		having any click on pagination bar for pagination filtering and sorting
     */
    $(document).on("click", "ul.pagination li a", function() {
        let namesorting = false;
        let pricesorting = false;
        let desc = false;
        let selectedCategory = getSeletedCategory();
        let search = $("#search").val();
        if($("#name_sorting"). prop("checked") == true){
            namesorting = true;
        }
        if($("#price_sorting"). prop("checked") == true){
            pricesorting = true;
        }

        if($("#desc_sorting"). prop("checked") == true){
            desc = true;
        }

        let val = $(this).text();

        // click on the NEXT tag
        if(val.toUpperCase()==="NEXT"){
            let activeValue = parseInt($("ul.pagination li.active").text());
            let totalPages = $("ul.pagination li").length - 4; // -4 beacause 1 for Previous and 1 for Next
            if(activeValue < totalPages){
                let currentActive = $("li.active");
                fetchproducts(activeValue, 5, search, selectedCategory, namesorting, pricesorting, desc); // get next page value
                // remove .active class for the old li tag
                $("li.active").removeClass("active");
                // add .active to next-pagination li
                currentActive.next().addClass("active");
            }
        } else if(val.toUpperCase()==="PREVIOUS"){
            let activeValue = parseInt($("ul.pagination li.active").text());
            if(activeValue > 1){
                // get the previous page
                fetchproducts(activeValue-2, 5, search, selectedCategory, namesorting, pricesorting, desc);
                let currentActive = $("li.active");
                currentActive.removeClass("active");
                // add .active to previous-pagination li
                currentActive.prev().addClass("active");
            }
        } else if(val.toUpperCase()==="FIRST") {
            fetchproducts(0, 5, search,  selectedCategory, namesorting, pricesorting, desc);
            $("li.active").removeClass("active");

            $(".carousel-inner .carousel-item:first-child").addClass("active");
            $("#first-page").addClass("active");

        } else if(val.toUpperCase()==="LAST") {
            let page = $("ul.pagination li").length -4;
            fetchproducts(page -1, 5, search,  selectedCategory, namesorting, pricesorting, desc);
            $("li.active").removeClass("active");
            $(".carousel-inner .carousel-item:last-child").addClass("active");
            $("#last-page").addClass("active");

        }
        else {
            fetchproducts(parseInt(val) - 1, 5, search,  selectedCategory, namesorting, pricesorting, desc);
            // add focus to the li tag
            $("li.active").removeClass("active");
            $(this).parent().addClass("active");
        }
    });

});

$('input[type="checkbox"]').on('change', function() {
    $('input[name="' + this.name + '"]').not(this).prop('checked', false);
});