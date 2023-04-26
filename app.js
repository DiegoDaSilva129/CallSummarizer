// Add event listener to form submit button to send the call transcription text to the server and display the summary
document.getElementById('summarize-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const transcription = document.getElementById('transcription').value;
  const summaryElement = document.getElementById('summary');
  
  // Check if call transcription text exists
  if (transcription) {
    try {
      // Send HTTP POST request to server API endpoint to generate the summary
      const response = await fetch('/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcription }),
      });

      // If server returns successful response, display the summary
      if (response.ok) {
        const data = await response.json();
        summaryElement.innerText = data.summary;
      } else {
        summaryElement.innerText = 'Error: Unable to generate summary';
      }
    } catch (error) {
      summaryElement.innerText = 'Error: Unable to connect to the server';
    }
  } else {
    summaryElement.innerText = 'Error: Please enter a call transcription';
  }
});
