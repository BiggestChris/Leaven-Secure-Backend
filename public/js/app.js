let auth0Client = null;

// ..



const fetchAuthConfig = () => fetch("../../auth_config.json");

const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();
  
    auth0Client = await auth0.createAuth0Client({
        domain: config.domain,
        clientId: config.clientId
    });

    console.log("Auth0 Client Initialized:", auth0Client);
};

// ..

window.onload = async () => {
    await configureClient();
  
    // NEW - update the UI state
    updateUI();
};
  
  // NEW
    const updateUI = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();
  
    document.getElementById("btn-logout").disabled = !isAuthenticated;
    document.getElementById("btn-login").disabled = isAuthenticated;
};