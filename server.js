const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;
const DATA_FILE = './contacts.json';

app.use(cors());
app.use(express.json());

// Utility to read/write JSON
const readContacts = () => JSON.parse(fs.readFileSync(DATA_FILE));
const writeContacts = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// GET all contacts
app.get('/contacts', (req, res) => {
  const contacts = readContacts();
  res.json(contacts);
});

// POST add new contact
app.post('/contacts', (req, res) => {
  const contacts = readContacts();
  const newContact = { id: Date.now(), ...req.body };
  contacts.push(newContact);
  writeContacts(contacts);
  res.status(201).json(newContact);
});

// PUT update contact
app.put('/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let contacts = readContacts();
  const index = contacts.findIndex(c => c.id === id);

  if (index === -1) return res.status(404).json({ error: 'Contact not found' });

  contacts[index] = { id, ...req.body };
  writeContacts(contacts);
  res.json(contacts[index]);
});

// DELETE contact
app.delete('/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let contacts = readContacts();
  contacts = contacts.filter(c => c.id !== id);
  writeContacts(contacts);
  res.json({ message: 'Contact deleted' });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
