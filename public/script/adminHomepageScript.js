    // Open delete modal
    function openDeleteModal(id, name) {
      document.getElementById('deleteUserId').value = id;
      document.getElementById('confirmDeleteText').textContent =
        `Are you sure you want to delete user "${name}"?`;
      new bootstrap.Modal(document.getElementById('confirmDeleteModal')).show();
    }

  // Open edit modal
  function openEditUserModal(id, name, email, balance) {
    document.getElementById('editUserId').value = id;
    document.getElementById('editUserName').value = name;
    document.getElementById('editUserEmail').value = email;
    document.getElementById('editUserBalance').value = balance;

    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();
  }

  