// login.js
import { auth, signInWithEmailAndPassword } from '/admin/js/firebase.js';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert('Login gagal: ' + error.message);
  }
});
