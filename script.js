const API_URL = 'http://localhost:3000/contacts';
let contacts = [];
let editIndex = null;

// Fetch contacts from backend
async function fetchContacts() {
  const res = await fetch(API_URL);
  contacts = await res.json();
  renderContacts();
}

// Add or update contact
async function addOrUpdateContact() {
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const photoInput = document.getElementById('photo');
  const addBtn = document.getElementById('addBtn');

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!name || !phone) {
    alert('Please enter both name and phone number.');
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async function () {
    const photo = photoInput.files[0] ? reader.result : (editIndex !== null ? contacts[editIndex].photo : null);
    const contact = { name, phone, photo };

    if (editIndex !== null) {
      const id = contacts[editIndex].id;
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
      editIndex = null;
      addBtn.textContent = 'Add Contact';
    } else {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
      const newContact = await res.json();
      contacts.push(newContact);
    }

    nameInput.value = '';
    phoneInput.value = '';
    photoInput.value = '';
    fetchContacts();
  };

  if (photoInput.files[0]) {
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    reader.onloadend();
  }
}

// Delete contact
async function deleteContact(index) {
  const contact = contacts[index];
  if (confirm('Are you sure you want to delete this contact?')) {
    await fetch(`${API_URL}/${contact.id}`, { method: 'DELETE' });
    fetchContacts();
  }
}

// Edit contact
function editContact(index) {
  const contact = contacts[index];
  document.getElementById('name').value = contact.name;
  document.getElementById('phone').value = contact.phone;
  document.getElementById('photo').value = '';
  document.getElementById('addBtn').textContent = 'Update Contact';
  editIndex = index;
}

// Render contacts
function renderContacts() {
  const list = document.getElementById('contactList');
  list.innerHTML = '';

  contacts.forEach((contact, index) => {
    const li = document.createElement('li');
    li.className = 'contact-item';

    li.innerHTML = `
      <div class="contact-info">
        <img src="${contact.photo || 'https://via.placeholder.com/50'}" alt="Contact Photo">
        <div>
          <strong>${contact.name}</strong><br />
          <span>${contact.phone}</span>
        </div>
      </div>
      <div class="contact-buttons">
        <button class="edit-btn" onclick="editContact(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteContact(${index})">Delete</button>
      </div>
    `;

    list.appendChild(li);
  });
}

// Initial load
fetchContacts();
