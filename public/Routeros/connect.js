import RouterOSClient from 'node-routeros';  // Use default import

async function setupApiConnection() {
  try {
    // Initialize the API connection
    const api = new RouterOSClient({
      host: 'app.vexifi.com:558',  // Your MikroTik router IP address
      user: 'api',                 // Your MikroTik admin username
      password: 'enock',           // Your MikroTik admin password
    });

    // Establish connection
    await api.connect();
    return api;

  } catch (error) {
    console.error('Failed to connect to RouterOS API:', error);
  }
}

async function checkAndModifyHotspotUsers(api) {
  try {
    // Fetch all active users in the Hotspot
    const activeUsers = await api.menu('/ip/hotspot/active').getAll();

    console.log('Active Hotspot Users:', activeUsers);

    // Loop through each user to check their usernames
    for (let user of activeUsers) {
      const userId = user['.id'];  // Access user ID
      const username = user.user;  // Access the username

      // Check for a specific username (e.g., 'old_username')
      if (username === 'old_username') {
        console.log(`Modifying username for user with ID: ${userId}`);

        // Modify the user's username (change it to 'new_username')
        await api.menu('/ip/hotspot/user').set({
          numbers: userId,          // ID of the user to modify
          name: 'new_username',     // New username to assign
        });

        console.log(`Username modified for user with ID: ${userId}`);
      }
    }
  } catch (error) {
    console.error('Error during hotspot user modification:', error);
  } finally {
    // Close the API connection
    api.close();
  }
}

// Setup API connection and run the function
setupApiConnection().then(api => {
  if (api) {
    checkAndModifyHotspotUsers(api);  // Pass the API instance to the function
  }
});

export default checkAndModifyHotspotUsers;
