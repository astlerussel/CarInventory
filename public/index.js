import 'https://cdnjs.cloudflare.com/ajax/libs/framework7/5.7.10/js/framework7.bundle.js';
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-app.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-database.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.1/firebase-auth.min.js";
import config from "./firebase.js";
import app from "./F7App.js";
import "./cars.js";

firebase.initializeApp(config);
const $$ = Dom7;
const provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        app.tab.show("#tab2", true);
        console.log(user);
    } else {
        app.tab.show("#tab1", true);
        console.log("logged out");
    }
});

// Login with Email and Password
$$("#loginForm").on("submit", (evt) => {
    evt.preventDefault();
    var formData = app.form.convertToData('#loginForm');
    firebase.auth().signInWithEmailAndPassword(formData.email, formData.password).then(
        () => {
            // could save extra info in a profile here I think.
            app.loginScreen.close(".loginYes", true);
        }
    ).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        $$("#signInError").html(errorCode + " error " + errorMessage)
        console.log(errorCode + " error " + errorMessage);
    });
});

// Sign Up with Email and Password
$$("#signUpForm").on("submit", (evt) => {
    evt.preventDefault();
    var formData = app.form.convertToData('#signUpForm');
    firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).then(
        () => {
            // could save extra info in a profile here I think.
            app.loginScreen.close(".signupYes", true);
        }
    ).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        $$("#signUpError").html(errorCode + " error " + errorMessage)
        console.log(errorCode + " error " + errorMessage);
    });
});

// Logout
$$("#logout").on("click", () => {
    firebase.auth().signOut().then(() => {
        console.log("User signed out.");
    }).catch(() => {
        console.error("Sign-out error occurred.");
    });
});

// Login with Google
$$("#googleSignIn").on("click", () => {
    firebase.auth().signInWithPopup(provider).then((result) => {
        // The signed-in user info.
        const user = result.user;
        console.log("Google Login Successful:", user);
        app.tab.show("#tab2", true);
        app.loginScreen.close(".loginYes", true);
        
    }).catch((error) => {
        console.error("Google Login Error:", error.message);
        $$("#googleSignInError").html(error.message);
    });
});

// Sign Up with Google
$$("#googleSignUp").on("click", () => {
    firebase.auth().signInWithPopup(provider).then((result) => {
        // The signed-up user info.
        const user = result.user;
        console.log("Google Sign-Up Successful:", user);
        app.tab.show("#tab2", true);
        app.loginScreen.close(".signupYes", true);
    }).catch((error) => {
        console.error("Google Sign-Up Error:", error.message);
        $$("#googleSignUpError").html(error.message);
    });
});
