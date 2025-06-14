import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getDatabase, ref, set, get, update, remove, onValue, push } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0aleQtzBmRiFQEqEOw-aaGqmyEn6FBPI",
  authDomain: "db-pian.firebaseapp.com",
  databaseURL: "https://db-pian-default-rtdb.firebaseio.com",
  projectId: "db-pian",
  storageBucket: "db-pian.firebasestorage.app",
  messagingSenderId: "55150345932",
  appId: "1:55150345932:web:df580a35564871ac84cc69"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, ref, set, get, update, remove, onValue, push, auth, signInWithEmailAndPassword };
