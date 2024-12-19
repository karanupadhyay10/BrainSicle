import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAz5suaLeuG8SWmPenyq4QZ71Z2ltNF7kc",
    authDomain: "brainsicle-52255.firebaseapp.com",
    databaseURL: "https://brainsicle-52255-default-rtdb.firebaseio.com",
    projectId: "brainsicle-52255",
    storageBucket: "brainsicle-52255.appspot.com",
    messagingSenderId: "659000052745",
    appId: "1:659000052745:web:cdfa947450ba3bce80bcd8"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', function() {

    // Sign-up form handler
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission

            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            if (!validate_email(email) || !validate_password(password)) {
                alert("Invalid Email or Password!");
                return;
            }

            console.log("Attempting to sign up..."); // Debug log
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    const database_ref = ref(database, 'users/' + user.uid);
                    const user_data = {
                        username: username,
                        email: email,
                        last_login: Date.now()
                    };

                    set(database_ref, user_data)
                        .then(() => {
                            alert("User Created Successfully!");
                            window.location.href = loginUrl;
                        })
                        .catch((error) => {
                            console.error("Error writing to database: ", error); // Debug log
                            alert("Failed to write to database: " + error.message);
                        });
                })
                .catch((error) => {
                    console.error("Sign-up error: ", error); // Debug log
                    alert(error.message);
                });
        });
    } else {
        // console.error("Signup form not found");
    }

    // Login form handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            if (!validate_email(email) || !validate_password(password)) {
                alert("Invalid Email or Password!");
                return;
            }

            console.log("Attempting to log in..."); // Debug log
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log("Login successful"); // Debug log
                    // alert("Logged in successfully!");
                    window.location.href = homeUrl;
                })
                .catch((error) => {
                    console.error("Login error: ", error); // Debug log
                    alert(error.message);
                });
        });
    } else {
        // console.error("Login form not found");
    }

    function validate_email(email) {
        const expression = /^[^@]+@\w+(\.\w+)+\w$/;
        return expression.test(email);
    }

    function validate_password(password) {
        return password.length >= 6;
    }
});
