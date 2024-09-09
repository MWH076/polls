// app.js

document.getElementById('google-login').addEventListener('click', googleLogin);
document.getElementById('poll-form').addEventListener('submit', submitVote);
document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById('poll-select').addEventListener('change', updatePollQuestion);

let selectedPollId = "poll1";

auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('login-container').classList.add('d-none');
        document.getElementById('poll-container').classList.remove('d-none');
        checkUserVote(user.uid, selectedPollId);
    } else {
        document.getElementById('login-container').classList.remove('d-none');
        document.getElementById('poll-container').classList.add('d-none');
    }
});

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => {
            console.log("User logged in:", result.user);
        })
        .catch(error => console.error("Login error:", error));
}

function submitVote(event) {
    event.preventDefault();
    const vote = document.querySelector('input[name="vote"]:checked').value;
    const userId = auth.currentUser.uid;

    db.collection('polls').doc(selectedPollId).collection('votes').doc(userId).set({
        vote: vote
    }).then(() => {
        displayResults(vote);
    }).catch(error => console.error("Error submitting vote: ", error));
}

function checkUserVote(userId, pollId) {
    db.collection('polls').doc(pollId).collection('votes').doc(userId).get().then(doc => {
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
    auth.signOut().then(() => {
        console.log("User logged out");
    }).catch(error => console.error("Logout error:", error));
}

function updatePollQuestion() {
    selectedPollId = document.getElementById('poll-select').value;
    if (selectedPollId === "poll1") {
        document.getElementById('poll-question').textContent = "Who will you be voting for in 2024?";
    } else if (selectedPollId === "poll2") {
        document.getElementById('poll-question').textContent = "Who will you be voting for in the Local City Election?";
    }

    if (auth.currentUser) {
        checkUserVote(auth.currentUser.uid, selectedPollId);
    }
}
