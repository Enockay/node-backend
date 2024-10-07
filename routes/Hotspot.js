import pkg from 'node-routeros';
const { RouterOSClient } = pkg;

// MikroTik API connection configuration
const api = new RouterOSClient({
  host: 'app.vexifi.com:558', // Your MikroTik router IP address
  user: 'api', // Your MikroTik username
  password: 'enock', // Your MikroTik password
});

async function checkAndModifyHotspotUsers() {
  let client;
  try {
    // Connect to the RouterOS API
    client = await api.connect();

    if (!client || !client.menu) {
      throw new Error('Failed to connect to RouterOS or retrieve client menu');
    }

    // Fetch all active users in the Hotspot
    const activeUsers = await client.menu('/ip/hotspot/active').getAll();
    console.log('Active Hotspot Users:', activeUsers);

    // Loop through each user to check their usernames
    for (let user of activeUsers) {
      const userId = user['.id']; // Access user ID
      const username = user.user; // Access the username

      // Check for a specific username (e.g., 'old_username')
      if (username === 'old_username') {
        console.log(`Modifying username for user with ID: ${userId}`);

        // Modify the user's username (change it to 'new_username')
        await client.menu('/ip/hotspot/user').set({
          numbers: userId, // ID of the user to modify
          name: 'new_username', // New username to assign
        });

        console.log(`Username modified for user with ID: ${userId}`);
      }
    }

    return { success: true, message: 'Hotspot users processed successfully' };
  } catch (error) {
    console.error('Error during hotspot user modification:', error);
    throw error; // Rethrow to be caught by the router
  } finally {
    // Ensure the API connection is closed if it was established
    if (client && client.close) {
      await client.close();
    }
  }
}

export default checkAndModifyHotspotUsers;
