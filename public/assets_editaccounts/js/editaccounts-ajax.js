$(document).ready(function(){
    function fetchaccounts(page, size, search, category, phonesorting, datesorting, desc){
        let pageNumber = (typeof page !== 'undefined') ?  page : 0;
        let sizeNumber = (typeof size !== 'undefined') ?  size : 5;
        let searched = (typeof search !== 'undefined') ? search : -1;
        let selectedcategory = (typeof category !== 'undefined') ?  category : -1;
        let phoneSorted = (typeof phonesorting !== 'undefined') ?  phonesorting: false;
        let dateSorted = (typeof datesorting !== 'undefined') ?  datesorting: false;
        let descDirection = (typeof desc !== 'undefined') ?  desc: false;

        /**
         * Do a fetching to get data from Backend's RESTAPI
         */
        $.ajax({
            type : "POST",
            url : "/admin/api/edit_accounts",
            data: {
                page: pageNumber,
                size: sizeNumber,
                search: searched,
                category: selectedcategory,
                phonesorting: phoneSorted,
                datesorting: dateSorted,
                desc: descDirection
            },
            success: function(response){
                $('#accountsTable tbody').empty();
                $.each(response.accounts, (i, account) => {
                    let check = null;
                    if(account.ACTIVE == 1)
                    {
                        check = '<i class="fa fa-unlock" style="color:green;" aria-hidden="true"></i>';
                    }
                    else check = '<i class="fa fa-lock" style="color:red;" aria-hidden="true"></i>';

                    let tmp = account.CREATEDDATE.split("-");
                    let dd = tmp[2].split("T");
                    let date = (parseInt(dd[0]) + 1) + "-" + tmp[1] + "-" + tmp[0];

                    let accountRow = '<tr>' +
                        '<td>' + account.ID + '</td>' +
                        '<td>' + account.PHONENUMBER + '</td>' +
                        '<td>' + date + '</td>' +
                        '<td>' + check + '</td>' +
                        '<td class="text-right">' + '<a class="btn btn-sm btn-dark" href="/admin/edit_accounts/' + account.ID +
                        '" role="button" title="Edit Accounts">' +
                        ' <i class="fas fa-user-cog"></i>' +
                        '</a>' + '</td>' +
                        '</tr>';
                    $('#accountsTable tbody').append(accountRow);
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

        let phonesorting = false;
        let datesorting = false;
        let desc = false;

        category = $("#selected_form").val();

        if($("#phone_sorting"). prop("checked") == true){
            phonesorting = true;
        }

        if($("#date_sorting"). prop("checked") == true){
            datesorting = true;
        }

        if($("#desc_sorting"). prop("checked") == true){
            desc = true;
        }

        // re-fetch customer list again
        fetchaccounts(0, 5, search, category, phonesorting, datesorting, desc);
    });
    /**
     * Select a category for pagination & filtering
     */
    $("select").change(function() {
        let category = '-1';
        let search = null;

        category = this.value;


        let phonesorting = false;
        let datesorting = false;
        let desc = false;

        if($("#phone_sorting"). prop("checked") == true){
            phonesorting = true;
        }

        if($("#date_sorting"). prop("checked") == true){
            datesorting = true;
        }

        if($("#desc_sorting"). prop("checked") == true){
            desc = true;
        }

        // re-fetch customer list again
        fetchaccounts(0, 5, search, category, phonesorting, datesorting, desc);
    });

    /**
     * Get a list of distinct salaries
     */
    function getListCategory(){
        $.ajax({
            type : "POST",
            url : "/admin/api/edit_accounts/active",
            success: function(response){
                $("#selected_form").empty();
                $('#selected_form').append("<option>All</option>");
                $.each(response.sort().reverse(), (i, ban) => {
                    // <option>All</option>
                    let tmp = null
                    if(ban == 1)
                        tmp = "Ban"
                    else tmp = "Not Ban"
                    let optionElement = "<option>" + tmp + "</option>";
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
     * phone_sorting checkbox is changed
     */
    $('#phone_sorting').on('change', function() {
        if(this.checked){
            $("#desc_sorting").removeAttr("disabled");
            $("#sortingbtn").removeAttr("disabled");
        }else {
            $("#desc_sorting").attr("disabled", true);
            $("#desc_sorting").prop("checked", false);
            $("#sortingbtn").attr("disabled", true);
        }
    });

    $('#date_sorting').on('change', function() {
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
        let phonesorting = false;
        let datesorting = false;
        let desc = false;
        let selectedCategory = getSeletedCategory();
        let search = $("#search").val();
        //get value of check boxes

        /* phonesorting checkbox */
        if($("#phone_sorting"). prop("checked") == true){
            phonesorting = true;
        }

        if($("#date_sorting"). prop("checked") == true){
            datesorting = true;
        }

        /* desc checkbox */
        if($("#desc_sorting"). prop("checked") == true){
            desc = true;
        }

        // get the active index of pagination bar
        let selectedPageIndex = parseInt($("ul.pagination li.active").text()) - 1;

        // just fetch again accounts from SpringBoot RestAPIs when sorting checkbox is checked
        if(phonesorting){
            fetchaccounts(selectedPageIndex, 5, search, selectedCategory, phonesorting, datesorting, desc); // get next page value
        }
        if(datesorting){
            fetchaccounts(selectedPageIndex, 5, search, selectedCategory, phonesorting, datesorting, desc); // get next page value
        }
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
     * Fetching the accounts from SpringBoot RestAPI at the initial time
     */
    (function(){
        // get first-page at initial time
        fetchaccounts(0);

        // get the distinct values of customer's salaries
        getListCategory();
    })();

    /**
     * Fetch again the customer's data from RestAPI when
     * 		having any click on pagination bar for pagination filtering and sorting
     */
    $(document).on("click", "ul.pagination li a", function() {
        let phonesorting = false;
        let datesorting = false;
        let desc = false;
        let selectedCategory = getSeletedCategory();
        let search = $("#search").val();
        if($("#phone_sorting"). prop("checked") == true){
            phonesorting = true;
        }
        if($("#date_sorting"). prop("checked") == true){
            datesorting = true;
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
                fetchaccounts(activeValue, 5, search, selectedCategory, phonesorting, datesorting, desc); // get next page value
                // remove .active class for the old li tag
                $("li.active").removeClass("active");
                // add .active to next-pagination li
                currentActive.next().addClass("active");
            }
        } else if(val.toUpperCase()==="PREVIOUS"){
            let activeValue = parseInt($("ul.pagination li.active").text());
            if(activeValue > 1){
                // get the previous page
                fetchaccounts(activeValue-2, 5, search, selectedCategory, phonesorting, datesorting, desc);
                let currentActive = $("li.active");
                currentActive.removeClass("active");
                // add .active to previous-pagination li
                currentActive.prev().addClass("active");
            }
        } else if(val.toUpperCase()==="FIRST") {
            fetchaccounts(0, 5, search,  selectedCategory,  phonesorting, datesorting, desc);
            $("li.active").removeClass("active");

            $(".carousel-inner .carousel-item:first-child").addClass("active");
            $("#first-page").addClass("active");

        } else if(val.toUpperCase()==="LAST") {
            let page = $("ul.pagination li").length -4;
            fetchaccounts(page -1, 5, search,  selectedCategory, phonesorting, datesorting, desc);
            $("li.active").removeClass("active");
            $(".carousel-inner .carousel-item:last-child").addClass("active");
            $("#last-page").addClass("active");

        }
        else {
            fetchaccounts(parseInt(val) - 1, 5, search,  selectedCategory, phonesorting, datesorting, desc);
            // add focus to the li tag
            $("li.active").removeClass("active");
            $(this).parent().addClass("active");
        }
    });

});

$('input[type="checkbox"]').on('change', function() {
    $('input[name="' + this.name + '"]').not(this).prop('checked', false);
});