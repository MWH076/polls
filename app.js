document.getElementById('google-login').addEventListener('click', googleLogin);
document.getElementById('poll-form').addEventListener('submit', submitVote);
document.getElementById('logout-btn').addEventListener('click', logout);

auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('login-container').classList.add('d-none');
        document.getElementById('poll-container').classList.remove('d-none');
        checkUserVote(user.uid);
    } else {
        document.getElementById('login-container').classList.remove('d-none');
        document.getElementById('poll-container').classList.add('d-none');
    }
});

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .catch(error => console.error(error));
}

function submitVote(event) {
    event.preventDefault();
    const vote = document.querySelector('input[name="vote"]:checked').value;
    const userId = auth.currentUser.uid;

    db.collection('votes').doc(userId).set({
        vote: vote
    }).then(() => {
        displayResults(vote);
    }).catch(error => console.error("Error submitting vote: ", error));
}

function checkUserVote(userId) {
    db.collection('votes').doc(userId).get().then(doc => {
        if (doc.exists) {
            displayResults(doc.data().vote);
        }
    }).catch(error => console.error("Error checking vote: ", error));
}

function displayResults(vote) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<h4>You voted for: ${vote}</h4>`;
}

function logout() {
    auth.signOut();
}
