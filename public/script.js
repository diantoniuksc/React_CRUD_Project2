// import helper functions for crud frontend user experience
import { validateItem, renderItem } from './crud.js';

// function to fetch items and render them
const getItems = async () => {
  try { 
      const response = await fetch('/api/items');
      const items = await response.json(); 
      content.innerHTML = ''; // clear away any previous items
      content.classList.remove('loading')
      items.forEach(renderItem);
  } catch (error) {
      console.log(error);
  }
};
 
// Add event listener to the file input to handle image preview
document.getElementById('imageUrl').addEventListener('change', (event) => {
  const file = event.target.files[0];  // Get the selected file
  const previewContainer = document.getElementById('imagePreviewContainer');
  const previewImage = document.getElementById('imagePreview');

  if (file) {
    const reader = new FileReader();  // Create a new FileReader to read the file
    // When the file is loaded, set the image source to the file data
    reader.onload = function(e) {
      previewImage.src = e.target.result;  // Set the image preview source to the file content
      previewContainer.style.display = 'block';  // Show the image preview
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);
  } else {
    previewContainer.style.display = 'none';  // Hide the preview if no file is selected
  }
});

// Function to reset the form.
// NOTE: this is augmenting the default reset behaviour which already blanks out most form elements.
// Here we also do a visual / narrative reset and blank out  hidden fields 
itemForm.addEventListener('reset', (event) => { 
  formHeading.innerHTML = 'Add a User';
  noticeArea.style.display = 'none';
  noticeArea.innerHTML = '';
  event.currentTarget.elements['_id'].value = '';
  const previewContainer = document.getElementById('imagePreviewContainer');
  const previewImage = document.getElementById('imagePreview');
  previewImage.src = ''; 
  previewContainer.style.display = 'none';
})

const saveItem = async (data) => {
  const formData = new FormData();
  
  // Append all form fields to formData
  for (let key in data) {
    if (data[key]) formData.append(key, data[key]);
    console.log(data[key]);
  }

  console.log('This is form data:');
  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });

  try {

    const url = data._id ? `/api/item/${data._id}` : '/api/item'; // Use PUT if _id exists
    const method = data._id ? 'PUT' : 'POST';

    console.log(url);

    const response = await fetch(url, {
      method,
      body: formData, // Send formData which includes text and image
    });

    /*const response = await fetch('/api/item', {
      method: 'POST',
      body: formData,  // Send formData which includes text and image
    });*/
    console.log(response);
    if (!response.ok) {
      throw new Error('Error saving item');
    }
    await getItems(); // Reload the list after saving
  } catch (error) {
    console.error('Error:', error);
  }
};

// Listen for Form submit and save the data 
itemForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = getFormData(event.target);
  if (validateItem(data)) {
    try{
      console.log(data);
    saveItem(data).then(() => { 
      itemForm.reset();
      formPopover.hidePopover();
    }); 
  }
  catch(error)
  {
    console.log(error.content);
  }
  }
});

// Helper function to collect data from the form
const getFormData = (form) => {
  const formData = {};
  new FormData(form).forEach((value, key) => {
    formData[key] = value;
  });
  return formData;
};

// Reset the form when we click the add or cancel buttons
// NOTE: popover behaviours are handled here explicitly 
// this helps to create a consistent experience between different browsers.
document.querySelector('button#add').addEventListener('click', event => {
  itemForm.reset()  
  formPopover.showPopover();
})  

document.querySelector('form button.cancel').addEventListener('click', event => {
  itemForm.reset()  
  formPopover.hidePopover();  // Explicitly hide popover
})  

// fetch the initial list of items
getItems();