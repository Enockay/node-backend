
async function removeUserFromInternet(mac) {
  try {
    // Make a POST request to your PHP server to remove the user
    const phpServerEndpoint = 'https://mikrotik-server-2e924a061565.herokuapp.com/removeUserApi.php';
    const response = await fetch(phpServerEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Update content type
      },
      body: `mac=${encodeURIComponent(mac)}`, // Send data as form data
    });

    if (!response.ok) {
      throw new Error(`Failed to remove user from PHP server: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Handle JSON response
    if (result.success) {
      console.log('User removed from PHP server:', result.message);
    } else {
      console.error('Error in removing user from PHP server:', result.message);
    }
  } catch (err) {
    console.error('Error in removing user from PHP server:', err);
  }
}

export { removeUserFromInternet };
