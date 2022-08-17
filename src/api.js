// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:8080';
console.log(apiUrl)

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data', { data });
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function postUserFragment(user, fragmentData, fragmentType) {
  console.log('Posting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "POST",
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(fragmentType),
      body: fragmentData
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data from the POST request', { data });
  } catch (err) {
    console.error('Unable to call POST /v1/fragment', { err });
  }
}

export async function updateUserFragment(user, id, fragmentData, fragmentType) {
  console.log('Updating user fragments data...');
  console.log(id)
  console.log(fragmentData)
  console.log(fragmentType)
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "PUT",
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(fragmentType),
      body: fragmentData
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    //const data = await res.json();
    //console.log('Got user fragments data from the UPDATE request', { data });
  } catch (err) {
    console.error('Unable to call UPDATE /v1/fragment/:id', { err });
  }
}

export async function getFragmentByID(user, id) {
  console.log('Requesting user fragment data by ID...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const type = res.headers.get("Content-Type");
    console.log(type)
    let data;
    if(type.startsWith('image/')){
      data = await res.text();
    }else{
      data = await res.json();
    }
    const result = {
      type: type,
      data: data
    }
    //console.log('Got the fragment by ID', { data });
    //const data = await res.json();
    console.log('Got the fragment by ID', { data });
    return result;
  } catch (err) {
    console.error('Unable to call GET /v1/fragment/:id', { err });
  }
}

export async function deleteFragmentByID(user, id) {
  console.log('Deleting user fragment data by ID...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "DELETE",
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Delete user fragments data', { data });
  } catch (err) {
    console.error('Unable to call DELETE /v1/fragment/:id', { err });
  }
}