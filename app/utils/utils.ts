export function downloadJson(jsonData: any, filename: string): void {
    // Convert JSON data to string
    const jsonString = JSON.stringify(jsonData, null, 2);
  
    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });
  
    // Create a link element
    const link = document.createElement('a');
  
    // Set the download attribute with the filename
    link.download = filename;
  
    // Create a URL for the blob and set it as the href attribute
    link.href = window.URL.createObjectURL(blob);
  
    // Append the link to the document body
    document.body.appendChild(link);
  
    // Trigger the download by simulating a click on the link
    link.click();
  
    // Remove the link from the document
    document.body.removeChild(link);
  }