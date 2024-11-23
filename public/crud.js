const getFormData = () => {
    const formData = new FormData(itemForm);
    const data = Object.fromEntries(formData); 
    const fileInput = itemForm.querySelector('input[type="file"]');
    if (fileInput && fileInput.files[0]) {
        data.profilePicture = fileInput.files[0];
    }
    itemForm
      .querySelectorAll('input[type=checkbox]')
      .forEach(el => data[el.name] = el.checked ? true : false)      
    return data;
};

// The purpose of frontetnd validation is to give feedback to the user.
// this is different from backend validation (which is more about enforcing the rules.)
const validateItem = (data) => {
    const errors = [];  
    if (data.description.length < 20) errors.push('Description is too short.');  
    noticeArea.style.display = errors.length ? 'block' : 'none';
    noticeArea.innerHTML = errors.join(' ');
    return errors.length === 0;
};


const saveItem = async (data) => {
    console.log(data)
    const endpoint = data._id ? `/api/item/${data._id}` : '/api/item/';
    const options = {
        method: data._id ? "PUT" : "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }; 
    try {
        const response = await fetch(endpoint, options);
        const updatedItem = await response.json();
        renderItem(updatedItem); // Re-renderItem with updated data
    } catch (error) {
        console.log(error);
    }
};


const deleteItem = async (id) => {
    const endpoint = `/api/item/${id}`;
    const options = {method: "DELETE"}; 
    try {
        const response = await fetch(endpoint, options);
        const result = await response.json();
        document.querySelector(`[data-id="${id}"]`).remove(); // Remove from DOM
    } catch (error) {
        console.log(error);
    }
};

const editItem = (data) => { 
  
    Object.keys(data).forEach(field => { 
        const element = itemForm.elements[field];
        if (element) {  
            if (element.type=='checkbox') {
                element.checked = data[field];
            } else if (element.type == "date") { 
                element.value =  new Date(data[field]).toLocaleDateString('en-CA');
            } else{
                element.value = data[field];
            }
        }
    });

    formHeading.innerHTML = `Edit ${data.name}`;
};

const template = (data) => DOMPurify.sanitize(`
    <section class="image">
    <div class="frame">
        <img src="..${data.imageUrl}" alt="${data.name}" />
    </div>
    
    <div class="calendar" style="${(data.birthDate) ? '' : 'display:none;' }">
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
            Civil Status:  ${data.status}
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

const renderItem = (data) => {
    data.birthMonth = new Date(data.birthDate).toLocaleString("en-CA", { month: 'short', timeZone: "UTC"  } ) 
    data.birthDay = new Date(data.birthDate).toLocaleString("en-CA", {  day: '2-digit', timeZone: "UTC"  } )
    data.birthYear = new Date(data.birthDate).toLocaleString("en-CA", { year: 'numeric', timeZone: "UTC"  } )

    data.cssGradient = `linear-gradient(90deg, ${data.primaryColor} 0%, ${data.secondaryColor} 100%);`

    const div = document.createElement('div');
    div.classList.add('item');
    div.setAttribute('data-id', data._id);
    div.innerHTML = template(data); 
    div.querySelector('.edit').onclick = () => editItem(data);
    div.querySelector('.delete').onclick = () => deleteItem(data._id); 
    const existingElement = document.querySelector(`[data-id="${data._id}"]`);
    existingElement ? content.replaceChild(div, existingElement) : content.prepend(div);
};



// Export functions for use in other modules
export { getFormData, validateItem, saveItem, renderItem, deleteItem };
