// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwugzNuCwCR32jNxaKvrij-8q8_CvbxB0",
  authDomain: "newsify-62188.firebaseapp.com",
  databaseURL: "https://newsify-62188-default-rtdb.firebaseio.com",
  projectId: "newsify-62188",
  storageBucket: "newsify-62188.appspot.com",
  messagingSenderId: "935168986533",
  appId: "1:935168986533:web:f3631ecb1cd8555ccc2c4c",
  measurementId: "G-MX072QX321"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference your database
var FeedbackFormDB = firebase.database().ref("FeedbackForm");

// Add an event listener to the form submission
document.getElementById("feedback-form").addEventListener("submit", submitForm);

// Function to handle form submission
function submitForm(e) {
  e.preventDefault();

  var name = getElementVal("name");
  var email = getElementVal("email");
  var feedback = getElementVal("feedback");

  saveFeedback(name, email, feedback); // Call function to save feedback

  // Show alert for successful submission (optional)
  alert("Feedback submitted successfully!");

  // Reset the form
  document.getElementById("feedback-form").reset();
}

// Function to get form values by ID
const getElementVal = (id) => {
  return document.getElementById(id).value;
};

// Save feedback to Firebase
function saveFeedback(name, email, feedback) {
  var newFeedbackForm = FeedbackFormDB.push();
  newFeedbackForm.set({
    name: name,
    email: email,
    feedback: feedback,
  });
}
