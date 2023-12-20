
$("#add_user").submit(function(event){
    // alert("Data Inserted Successfully!")
})


$("#add_category").submit(function(event){
    alert("Data Inserted Successfully!")
})

$("#add_product").submit(function(event){
    alert("Data Inserted Successfully!")
})

$("#add_coupon").submit(function(event){
    alert("Data Update Successfully!")
})

$("#add_offer").submit(function(event){
    alert("Data Update Successfully!")
})




$("#update_product").submit(function(event){
    console.log("helo");
    event.preventDefault()

    var unindexed_array = $(this).serializeArray()
    var data = {}

    $.map(unindexed_array,function(n,i){
        data[n['name']] = n['value']
    })
    // console.log(data)

    var request = {
        "url" : `http://localhost:3000/api/product/${data.id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!")
    })
})

$("#update_category").submit(function(event){
    console.log("update_category");
    event.preventDefault()

    var unindexed_array = $(this).serializeArray()
    var data = {}

    $.map(unindexed_array,function(n,i){
        data[n['name']] = n['value']
    })
    console.log(data)

    var request = {
        "url" : `http://localhost:3000/api/categories/${data.categoryId}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!")
    })
})


// if(window.location.pathname =="/category"){
//     $ondelete = $(".table tbody td a.delete")
//     $ondelete.click(function(){
//         var id = $(this).attr("data-id")


//         var request = {
//             "url" : `http://localhost:3000/api/categories/${id}`,
//             "method" : "DELETE",
            
//         }

//             if(confirm("Do you really want to delete this record?")){
//                 $.ajax(request).done(function(response){
//                     alert("Data delete successfully")
//                     location.reload()
//                 })
//             }
//     })
// }