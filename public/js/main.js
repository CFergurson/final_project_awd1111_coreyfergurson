$(() => {
  $('form.needs-validation').on('submit', (evt) => {
    if (!evt.target.checkValidity()) {
      evt.preventDefault();
      evt.stopPropagation();
    }
    $(evt.target).addClass('was-validated');
  });
  
  $('#add-group-form').on('submit', (evt) => {
    evt.preventDefault();

    const formData = $('#add-group-form').serialize();
    //debug(formData);
    $.ajax({
      method: 'POST',
      url: '/api/group',
      dataType: 'json',
      data: formData,
    })
      .done((res) => {
        if (res.error) {
          $('#add-group-form output').html(res.error);
        } else {
          window.location = new URL(`/group`, window.location);
        }
      })
      .fail((xhr, textStatus, err) => {
        alert('#add-group-form output').html(`${textStatus} \n ${err}`);
      });
  });
  $('#edit-group-form').submit((evt) => {
    evt.preventDefault();

    const id = $('#_id').val();
    const formData = $(evt.target).serialize();
    console.log(formData);

    $.ajax({
      method: 'POST',
      url: `/api/group/${id}`,
      dataType: 'json',
      data: formData,
    })
      .done((res) => {
        if (res.error) {
          $('#edit-group-form output').html(res.error);
        } else {
          window.location = new URL(`/group`, window.location);
        }
      })
      .fail((xhr, textStatus, err) => {
        $('#edit-group-form output').html(`${textStatus} \n ${err.stack}`);
      });
  });
  $('#add-user-form').on('submit', (evt) => {
    evt.preventDefault();

    const formData = $('#add-user-form').serialize();
    //debug(formData);
    $.ajax({
      method: 'POST',
      url: '/api/account',
      dataType: 'json',
      data: formData,
    })
      .done((res) => {
        if (res.error) {
          $('#add-user-form output').html(res.error);
        } else {
          window.location = new URL(`/account`, window.location);
        }
      })
      .fail((xhr, textStatus, err) => {
        $('#add-user-form output').html(`${textStatus} \n ${err}`);
      });
  });
  $('#edit-user-form').submit((evt) => {
    evt.preventDefault();

    const id = $('#_id').val();
    const formData = $(evt.target).serialize();
    console.log(formData);

    $.ajax({
      method: 'POST',
      url: `/api/account/${id}`,
      dataType: 'json',
      data: formData
    })
      .done((res) => {
        if (res.error) {
          $('#edit-user-form output').html(res.error);
        } else {
          window.location = new URL(`/account`, window.location);
        }
      })
      .fail((xhr, textStatus, err) => {
        $('#edit-user-form output').html(`${textStatus} \n ${err.stack}`);
      });
  });
  $('#add-post-form').on('submit', (evt) => {
    evt.preventDefault();

    const formData = $('#add-post-form').serialize();
    //debug(formData);
    $.ajax({
      method: 'POST',
      url: '/api/post',
      dataType: 'json',
      data: formData,
    })
      .done((res) => {
        if (res.error) {
          $('#add-post-form output').html(res.error);
        } else {
          window.location = new URL(`/post`, window.location);
        }
      })
      .fail((xhr, textStatus, err) => {
        $('#add-post-form output').html(`${textStatus} \n ${err}`);
      });
  });
  $('#edit-post-form').submit((evt) => {
    evt.preventDefault();

    const id = $('#_id').val();
    const formData = $(evt.target).serialize();
    console.log(formData);

    $.ajax({
      method: 'POST',
      url: `/api/post/${id}`,
      dataType: 'json',
      data: formData
    })
      .done((res) => {
        if (res.error) {
          $('#edit-post-form output').html(res.error);
        } else {
          window.location = new URL(`/post`, window.location);
        }
      })
      .fail((xhr, textStatus, err) => {
        $('#edit-post-form output').html(`${textStatus} \n ${err.stack}`);
      });
  });
  $('#login_form').on('submit', (evt) => {
    evt.preventDefault();

    const formData = $('#login_form').serialize();
    //debug(formData);
    $.ajax({
      method: 'POST',
      url: '/api/login',
      dataType: 'json',
      data: formData,
    })
      .done((res) => {
        if (res.error) {
          $('#login_form output').html(res.error);
        } else {
          window.location = new URL(`/group`, window.location);
        }
      })
      .fail((xhr, textStatus, err) => {
        $('#login_form output').html(`${textStatus} \n ${err}`);
      });
  });
});

//$(() => {
//   $('#add-group-form').on('submit', (evt) => {
//     evt.preventDefault();

//     const formData = $('#add-group-form').serialize();
//     //debug(formData);
//     $.ajax({
//       method: 'POST',
//       url: '/api/group',
//       dataType: 'json',
//       data: formData,
//     })
//       .done((res) => {
//         if (res.error) {
//           $('#add-group-form output').html(res.error);
//         } else {
//           window.location = new URL(`/group/${res[0]}`, window.location);
//         }
//       })
//       .fail((xhr, textStatus, err) => {
//         alert('#add-group-form output').html(`${textStatus} \n ${err}`);
//       });
//   });
//   $('#edit-group-form').submit((evt) => {
//     evt.preventDefault();

//     const id = $('#id').val();
//     const formData = $(evt.target).serialize();
//     console.log(formData);

//     $.ajax({
//       method: 'PUT',
//       url: `/api/group/${id}`,
//       dataType: 'json',
//       data: formData
//     })
//       .done((res) => {
//         if (res.error) {
//           $('#edit-group-form output').html(res.error);
//         } else {
//           window.location = new URL(`/`, window.location);
//         }
//       })
//       .fail((xhr, textStatus, err) => {
//         $('#edit-group-form output').html(`${textStatus} \n ${err}`);
//       });
//   });
//   $('.delete-group-from-list').click((evt) => {
//     //had a debug here but it broke the code...why?!?!?!?!?!?!?!
//     const id = $(evt.target).data('id');
//     const name = $(evt.target).data('name');
//     const confirm_delete = confirm(`Are you sure you want to delete "${name}"`);
//     if (confirm_delete) {
//       $.ajax({
//         method: 'DELETE',
//         url: `/api/group/${id}`,
//         dataType: 'json',
//       })
//         .done((res) => {
//           if(res.error){
//             alert(res.error);
//           }else{
//           window.location.reload();
//           }
//         })
//         .fail((xhr, textStatus, err) => {
//           alert(`${textStatus} \n ${err}`);
//         });
//     }
//   });
//   $('#login_form').on('submit', (evt) => {
//     evt.preventDefault();

//     const formData = $('#login_form').serialize();
//     $.ajax({
//       method: 'POST',
//       url: `/login`,
//       dataType: 'json',
//       data: formData,
//     })
//     .done((res) => {
//       if(res.error){
//         $('#login_form output').html(res.error);
//       }else{
//         window.location = new URL(`/group`, window.location);
//       }
//     })
//     .fail((xhr, textStatus, err) => {
//       $('#login_form output').html(`${textStatus} \n ${err}`);
//     });
//   })
// });
