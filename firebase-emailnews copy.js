// Reference your database for the newsletter form
var SubscribeFormDB = firebase.database().ref("Newsletter");

// Add an event listener to the form submission
document.getElementById("subscribe-form").addEventListener("submit", submitForm);

// Function to handle form submission
function submitForm(e) {
    e.preventDefault();

    var email = getElementVal1("subscribe-email"); // Ensure ID matches the input field

    saveEmail(email); // Call function to save the email

    // Show alert for successful submission
    alert("Subscribed successfully!");

    // Reset the form
    document.getElementById("subscribe-form").reset();
}

// Function to get form values by ID
const getElementVal1 = (id) => {
    return document.getElementById(id).value;
};

// Save email to Firebase
function saveEmail(email) {
    var newSubscribeForm = SubscribeFormDB.push(); // Save the email to the "Newsletter" reference
    newSubscribeForm.set({
        email: email,
    });
}
