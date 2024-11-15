// Contact.jsx
import React from 'react';
import Sidebar from './Sidebar'; // Import the Sidebar component
import Header from './Header'; // Import the Header component
import './App.css'; // Import your existing styles

const Contact = () => {
  // Sample data for each contact
  const contacts = [
    {
      id: 1,
      name: 'Gilbert Sambow',
      photo: 'url_to_photo_1.jpg',
      info: 'Engineer.',
    },
    {
      id: 2,
      name: 'Clay Mangeber',
      photo: 'url_to_photo_2.jpg',
      info: 'Designer.',
    },
    {
      id: 3,
      name: 'Aaron Rawung',
      photo: 'url_to_photo_3.jpg',
      info: 'Resources.',
    },
  ];

  return (
    <div className="App-Contact">
      <Sidebar />
      <div className="content">
        <Header />
        {/* Display a grid with three columns */}
        <div className="grid-container-contact">
          {contacts.map((contact) => (
            <div key={contact.id} className="card-contact">
              {/* Photo */}
              <img src={contact.photo} alt={contact.name} className="contact-photo" />
              {/* Information */}
              <p className="contact-info">{contact.info}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
