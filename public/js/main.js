$(document).ready(function() {
  $('.delete-user').on('click',function(e){
    $target=$(e.target);
    const id=$target.attr('data-id');
    var validation=confirm("Etes-vous sure d'annuler ce rendez-vous ? ");
  if(validation)
  {
    $.ajax({
      type:"DELETE",
      url:'/user/delete/'+id,
      success:function(rep){
        window.location.href='/user';
      }
    });
  }

});
$('.delete-rdv').on('click',function(e){
  $target=$(e.target);
  const id=$target.attr('data-id');
  var validation=confirm("Etes-vous sure d'annuler ce rendez-vous ? ");
  if(validation)
  {
    $.ajax({
      type:"DELETE",
      url:'/agenda/rdv/delete/'+id,
      success:function(rep){
        if(window.location.pathname=='/user/admin/agenda'){
          window.location.href='/user/admin/agenda';
        }
        else{
          window.location.href='/user/profile/'+$('.username').val();
        }

      }
    });
  }

});
$('.update-admin').on('click',function(e){
  $target=$(e.target);
  const id=$target.attr('data-id');
  alert(id);
  $.ajax({
    type:"PUT",
    url:'/user/admin/update/'+id,
    success:function(rep){
      window.location.href='/user/admin/coordonnees';
    }
  });
});
});
