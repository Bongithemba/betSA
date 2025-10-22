  const betModal = new bootstrap.Modal(document.getElementById('betModal'));
  const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));

  function openbetModal(data) {
    const team1Btn = document.getElementById('team1Btn');
    const team2Btn = document.getElementById('team2Btn');

    team1Btn.textContent = data.team1 || 'N/A';
    team2Btn.textContent = data.team2 || 'N/A';

    team1Btn.onclick = () => openconfirmModal({
      team: data.team1,
      event: data.event,
      type: data.type,
      modifier: data.modifier1,
      payout: data.payout1,
      source: data.source1
    });

    team2Btn.onclick = () => openconfirmModal({
      team: data.team2,
      event: data.event,
      type: data.type,
      modifier: data.modifier2,
      payout: data.payout2,
      source: data.source2
    });

    betModal.show();
  }

  function closebetModal(event) {
    event.preventDefault();
    betModal.hide();
  }

  function openconfirmModal(data) {
    betModal.hide();

    document.getElementById('confirmTeam').textContent = data.team || 'N/A';
    document.getElementById('confirmEvent').textContent = data.event || 'N/A';
    document.getElementById('confirmType').textContent = data.type || 'N/A';
    document.getElementById('confirmModifier').textContent = data.modifier || 'N/A';
    document.getElementById('confirmPayout').textContent = data.payout || 'N/A';
    document.getElementById('confirmSource').textContent = data.source || 'N/A';

    document.getElementById('formTeamName').value = data.team || '';
    document.getElementById('formEventName').value = data.event || '';
    document.getElementById('formPayout').value = data.payout || '';

    confirmModal.show();
  }

  function closeConfirmModal(event) {
    event.preventDefault();
    confirmModal.hide();
  }