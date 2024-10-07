import express from 'express';
import fetch from 'node-fetch';

const app = express();
const mikrotikApiUrl = 'http://192.168.88.1:8729'; 

const addUser = async (ipAddress,res)=> {
  try {
    // Assuming you send the IP address in the request body

    // Send request to MikroTik router to add IP address
    console.log("establishing mikrotik router access now ")
    const response = await fetch(`${mikrotikApiUrl}/add-ip?ip=${ipAddress}`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('admin:enock').toString('base64'),
      },
    });

    const result = await response.json();

    // Handle the result from MikroTik router
    if (result.success) {
      console.log("user successfully added to the system");
    } else {
      console.log('Failed to add IP address to MikroTik router');
    }
  } catch (error) {
    console.error(error, "error occured in fetching mikrotik  router ");
  }
};

const removeUser = async (ipAddress) => {

  try {
     // Assuming you send the IP address in the request body

    // Send request to MikroTik router to remove IP address
    const response = await fetch(`${mikrotikApiUrl}/remove-ip?ip=${ipAddress}`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('admin:enock').toString('base64'),
      },
    });

    const result = await response.json();

    // Handle the result from MikroTik router
    if (result.success) {
      res.json({ success: true, message: 'IP address removed successfully' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to remove IP address from MikroTik router' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export {addUser,removeUser}