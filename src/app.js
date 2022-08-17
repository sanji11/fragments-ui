// src/app.js

import { Auth, getUser } from './auth';
import { getUserFragments, postUserFragment, updateUserFragment ,getFragmentByID, deleteFragmentByID } from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const createFragmentBtn = document.querySelector('#createFragment');
  const textInput = document.getElementById('fragmentData');
  const getByIDBtn = document.querySelector('#getFragmentByID');
  const idInput = document.getElementById('fragmentID');
  const selectedType = document.getElementById('fragmentType')
  const input = document.getElementById('image');
  const displayFragmentData = document.getElementById('displayFragmentData');
  const updateFragmentIDInput = document.getElementById('updateFragmentID');
  const updateFragmentBtn = document.querySelector('#updateFragment');
  const deleteFragmentByIDBtn = document.querySelector('#deleteFragmentByID');
  

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
  createFragmentBtn.onclick = async ()=>{
    console.log('Create button clicked');
    console.log(textInput.value);
    console.log(selectedType.value);
    if(selectedType.value.startsWith('image/')){
      await postUserFragment(user, input.files[0], selectedType.value);
    }else{
      await postUserFragment(user,JSON.stringify(textInput.value), selectedType.value);
    }
  }

  updateFragmentBtn.onclick = async ()=>{
    console.log('Update button clicked');
    console.log(textInput.value);
    console.log(updateFragmentIDInput.value);
    console.log(selectedType.value);
    if(selectedType.value.startsWith('image/')){
      await updateUserFragment(user, updateFragmentIDInput.value, input.files[0], selectedType.value);
    }else{
      await updateUserFragment(user, updateFragmentIDInput.value, JSON.stringify(textInput.value), selectedType.value);
    }
  }

  getByIDBtn.onclick = async ()=>{
    console.log('Get fragment by id button clicked');
    console.log(idInput.value);
    const result = await getFragmentByID(user, idInput.value);
    console.log(result)
    if(result.type.startsWith('image/')){
      displayFragmentData.innerHTML = `<img src="data:${result.type};base64,${result.data}" />` 
    }else{
      displayFragmentData.innerHTML = `<pre>${result.data}</pre>`
    }  
  }

  deleteFragmentByIDBtn.onclick = async ()=>{
    console.log('Delete fragment by id button clicked');
    console.log(idInput.value);
    await deleteFragmentByID(user, idInput.value);
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

// Event handler executed when a file is selected
// const onSelectFile = () => upload(input.files[0]);

// Add a listener on your input
// It will be triggered when a file will be selected
// input.addEventListener('change', onSelectFile, false);

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);