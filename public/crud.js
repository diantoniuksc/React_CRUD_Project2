// Extracts and processes form data from the item form.
const getFormData = () => {
    const formData = new FormData(itemForm); // Create a FormData object for the form.
    const data = Object.fromEntries(formData); // Convert form data to an object.
    const fileInput = itemForm.querySelector('input[type="file"]');
    
    // If a file input is present and a file is selected, include it in the data.
    if (fileInput && fileInput.files[0]) {
        data.profilePicture = fileInput.files[0];
    }
    
    // Process checkbox inputs, converting their values to boolean.
    itemForm
      .querySelectorAll('input[type=checkbox]')
      .forEach(el => data[el.name] = el.checked ? true : false);
    
    return data; // Return the processed form data.
};

// Validates the item data on the frontend to provide immediate user feedback.
const validateItem = (data) => {
    const errors = []; // Array to hold validation error messages.

    // Ensure the description field has a minimum length.
    if (data.description.length < 20) errors.push('Description is too short.');
    
    // Display validation errors in the notice area, if any.
    noticeArea.style.display = errors.length ? 'block' : 'none';
    noticeArea.innerHTML = errors.join(' ');

    // Return true if there are no errors, false otherwise.
    return errors.length === 0;
};

// Sends a save request (create or update) to the backend for the item.
const saveItem = async (data) => {
    console.log(data); // Log the data for debugging.
    const endpoint = data._id ? `/api/item/${data._id}` : '/api/item/'; // Determine API endpoint.
    const options = {
        method: data._id ? "PUT" : "POST", // Use PUT for updates, POST for creation.
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data) // Convert data to JSON for the request.
    };

    try {
        const response = await fetch(endpoint, options); // Send the request.
        const updatedItem = await response.json(); // Parse the response JSON.
        renderItem(updatedItem); // Update the UI with the new/updated item.
    } catch (error) {
        console.log(error); // Log errors for debugging.
    }
};

// Sends a delete request to the backend and removes the item from the UI.
const deleteItem = async (id) => {
    const endpoint = `/api/item/${id}`; // API endpoint for deletion.
    const options = {method: "DELETE"}; // Use DELETE method.

    try {
        const response = await fetch(endpoint, options); // Send the request.
        const result = await response.json(); // Parse the response JSON.
        document.querySelector(`[data-id="${id}"]`).remove(); // Remove the item from the DOM.
    } catch (error) {
        console.log(error); // Log errors for debugging.
    }
};

// Populates the form fields with the provided item's data for editing.
const editItem = (data) => {
    Object.keys(data).forEach(field => { 
        const element = itemForm.elements[field]; // Get the corresponding form field.

        if (element) {  
            if (element.type === 'checkbox') {
                element.checked = data[field]; // Set checkbox state.
            } else if (element.type === "date") { 
                element.value = new Date(data[field]).toLocaleDateString('en-CA'); // Format date.
            } else {
                element.value = data[field]; // Set other field values.
            }
        }
    });

    // Update the form heading to indicate editing mode.
    formHeading.innerHTML = `Edit ${data.name}`;
};

// Generates a sanitized HTML template for displaying an item's details.
const template = (data) => DOMPurify.sanitize(`
    <section class="image">
        <div class="frame">
            <img src="..${data.imageUrl}" alt="${data.name}" />
        </div>
        <div class="calendar" style="${data.birthDate ? '' : 'display:none;'}">
            <div class="born"><img src="/assets/birthday.svg" alt="Birthday Icon" /></div>
            <div class="birthMonth">${data.birthMonth}</div>
            <div class="birthDay">${data.birthDay}</div> 
            <div class="birthYear">${data.birthYear}</div>
        </div>
    </section>
    <section class="information">
        <header>
            <h2 style="background: ${data.cssGradient}; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: black;">
                ${data.name}
            </h2>
            <h3>${data.ethnicity}</h3>
        </header>
        <main>
            <p class="description">${data.description}</p>
            <div class="stats">
                <div class="stat">
                    <span>Social battery:</span>
                    <meter max="10" min="0" value="${data.personality}"></meter>
                </div>
            </div>
            <section class="statusId">
                Civil Status: ${data.status}
            </section>
            <section class="statusId">
                <span>ID Number: ${data.idNumber}</span>
            </section>
        </main>
        <div class="options">
            <button class="edit" popovertarget="formPopover">Edit</button>
            <button class="delete">Delete</button>
        </div>
    </section>
`);

// Renders an item in the UI, adding event listeners for edit and delete buttons.
const renderItem = (data) => {
    // Format birthdate components.
    data.birthMonth = new Date(data.birthDate).toLocaleString("en-CA", { month: 'short', timeZone: "UTC" });
    data.birthDay = new Date(data.birthDate).toLocaleString("en-CA", { day: '2-digit', timeZone: "UTC" });
    data.birthYear = new Date(data.birthDate).toLocaleString("en-CA", { year: 'numeric', timeZone: "UTC" });

    // Generate a CSS gradient for the item's name.
    data.cssGradient = `linear-gradient(90deg, ${data.primaryColor} 0%, ${data.secondaryColor} 100%);`;

    // Create a new DOM element for the item.
    const div = document.createElement('div');
    div.classList.add('item');
    div.setAttribute('data-id', data._id);
    div.innerHTML = template(data);

    // Add event listeners for edit and delete buttons.
    div.querySelector('.edit').onclick = () => editItem(data);
    div.querySelector('.delete').onclick = () => deleteItem(data._id);

    // Replace the existing item in the DOM or add it to the top.
    const existingElement = document.querySelector(`[data-id="${data._id}"]`);
    existingElement ? content.replaceChild(div, existingElement) : content.prepend(div);
};

// Export functions for use in other modules.
export { getFormData, validateItem, saveItem, renderItem, deleteItem };
