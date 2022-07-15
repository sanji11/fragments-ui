// src/app.js

import { Auth, getUser } from './auth';
import { getUserFragments, postUserFragment, getFragmentByID } from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const submitBtn = document.querySelector('#submit');
  const textInput = document.getElementById('fragmentData');
  const getByIDBtn = document.querySelector('#GetFragmentByID');
  const idInput = document.getElementById('fragmentID');
  const selectedType = document.getElementById('fragmentType')

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }
  submitBtn.onclick = async ()=>{
    console.log('Submit button clicked');
    console.log(textInput.value);
    console.log(selectedType.value);
    await postUserFragment(user,JSON.stringify(textInput.value), selectedType.value);
  }

  getByIDBtn.onclick = async ()=>{
    console.log('Get fragment by id button clicked');
    console.log(idInput.value);
    await getFragmentByID(user, idInput.value)
  }
  // Log the user info for debugging purposes
  console.log({ user });
 
  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;

  // Do an authenticated request to the fragments API server and log the result
  await getUserFragments(user);

}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);