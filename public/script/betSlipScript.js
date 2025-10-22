    function openDeleteModal(event, winner) {
      document.getElementById('deleteBetEvent').value = event;
      document.getElementById('confirmDeleteText').textContent =
        `Are you sure you want to delete winner: "${winner}"?`;
      document.getElementById('confirmDeleteModal').style.display = 'flex';
    }

    function closeDeleteModal() {
      document.getElementById('confirmDeleteModal').style.display = 'none';
    }