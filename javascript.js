function upload(){
    modal.style.display = "none";

    //get your image
    var image=document.getElementById('image').files[0];
    //get your blog text
    var post=document.getElementById('post').value;
    var amount = document.getElementById('price').value;


    //get image name
    var imageName=image.name;
    //firebase storage reference
    //it is the path where your image will be stored
    var storageRef=firebase.storage().ref('images/'+imageName);
    //upload image to selected storage reference
    //make sure you pass image here
    var uploadTask=storageRef.put(image);
    //to get the state of image uploading....
    uploadTask.on('state_changed',function(snapshot){
         //get task progress by following code
         var progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
         console.log("upload is "+progress+" done");
    },function(error){
      //handle error here
      console.log(error.message);
    },function(){
        //handle successfull upload here..
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
           //get your image download url here and upload it to databse
           //our path where data is stored ...push is used so that every post have unique id
           firebase.database().ref('blogs/').push().set({
                 text:post,
                 cost:amount,
                 imageURL:downloadURL,
           },function(error){
               if(error){
                   alert("Error while uploading");
               }else{
                   //now reset your form
                   document.getElementById('post-form').reset();
                   getdata();


               }
           });
        });
    });

}

window.onload=function(){
    this.getdata();
    
}


function getdata(){
    //firebase.database().ref('blogs/').once('value').then(function(snapshot){
        firebase.database().ref('blogs/').on('value', function(snapshot){
        
      //get your posts div
      var posts_div=document.getElementById('posts');
      //remove all remaining data in that div
      posts.innerHTML="";
      //get data from firebase
      var data=snapshot.val();
      console.log(data);
      //now pass this data to our posts div
      //we have to pass our data to for loop to get one by one
      //we are passing the key of that post to delete it from database
      for(let[key,value] of Object.entries(data)){

        

            posts_div.innerHTML="<div class='col-sm-4 mt-2 mb-1'>"+
            "<div style= 'padding-top: 20px; margin:5px 5px;' class='card '>"+
            "<embed mx-auto d-block mt-5 src='"+value.imageURL+"' loading='lazy' style='height:250;'>"+
            "<div class='card-body'><p class='card-text'>"+value.text+"</p>"+
            "<p class='card-text'>"+value.cost+"</p>"+
            // "<a href='"+value.imageURL+"'target='_blank' style='float: left;' class='btn btn-outline-danger'  '>Buy</a>"+

            "<a href='"+value.imageURL+"'target='_blank' style='float: left;' class='btn btn-outline-danger'  '>Download</a>"+


            // "<button class='btn btn-danger' id='"+key+"' style='float: right;' onclick='delete_post(this.id)'>Delete</button>"+
            "</div></div></div>"+posts_div.innerHTML;
        
        



        
      }
    
    });
}

function delete_post(key){
    firebase.database().ref('blogs/'+key).remove();
    getdata();

}



// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
