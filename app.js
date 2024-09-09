document.getElementById('back-btn').addEventListener('click', () => {
    document.getElementById('poll-details').classList.add('d-none');
    document.getElementById('poll-list').classList.remove('d-none');
});

auth.onAuthStateChanged(user => {
    if (user) {
        loadPolls();
    }
});

function loadPolls() {
    const pollList = document.getElementById('poll-list');
    db.collection('polls').get().then(snapshot => {
        snapshot.forEach(doc => {
            const poll = doc.data();
            const pollItem = document.createElement('a');
            pollItem.classList.add('list-group-item', 'list-group-item-action');
            pollItem.textContent = poll.question;
            pollItem.href = "#";
            pollItem.addEventListener('click', () => showPollDetails(doc.id, poll));
            pollList.appendChild(pollItem);
        });
    }).catch(error => console.error("Error loading polls: ", error));
}

function showPollDetails(pollId, poll) {
    document.getElementById('poll-list').classList.add('d-none');
    document.getElementById('poll-details').classList.remove('d-none');

    const pollQuestion = document.getElementById('poll-question');
    pollQuestion.textContent = poll.question;

    const pollForm = document.getElementById('poll-form');
    pollForm.innerHTML = ''; // Clear previous options

    poll.options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('form-check');
        const optionInput = document.createElement('input');
        optionInput.classList.add('form-check-input');
        optionInput.type = 'radio';
        optionInput.name = 'vote';
        optionInput.value = option;
        const optionLabel = document.createElement('label');
        optionLabel.classList.add('form-check-label');
        optionLabel.textContent = option;
        optionDiv.appendChild(optionInput);
        optionDiv.appendChild(optionLabel);
        pollForm.appendChild(optionDiv);
    });

    pollForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedVote = document.querySelector('input[name="vote"]:checked').value;
        submitVote(pollId, selectedVote);
    });

    checkUserVote(pollId);
}

function submitVote(pollId, vote) {
    const userId = auth.currentUser.uid;

    db.collection('votes').doc(pollId).collection('userVotes').doc(userId).set({
        vote: vote
    }).then(() => {
        displayResults(vote);
    }).catch(error => console.error("Error submitting vote: ", error));
}

function checkUserVote(pollId) {
    const userId = auth.currentUser.uid;

    db.collection('votes').doc(pollId).collection('userVotes').doc(userId).get().then(doc => {
        if (doc.exists) {
            displayResults(doc.data().vote);
        }
    }).catch(error => console.error("Error checking vote: ", error));
}

function displayResults(vote) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<h4>You voted for: ${vote}</h4>`;
}
