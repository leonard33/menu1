import React, { useState, useEffect } from 'react';
import Category from '../compoents/Category';
import Menuform from '../compoents/Menuform';
import axios from 'axios';
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { Button, Modal } from 'react-bootstrap';

const Adminpanel = () => {
  const [menuitems, setMenuitems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editedItem, setEditedItem] = useState({
    itemname: '',
    description: '',
    price: '',
    category_id: '',
  });

  useEffect(() => {
    const fetchMenuitems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5000/menuitems');
        const categoriesResponse = await axios.get('http://localhost:5000/categories');
        setMenuitems(response.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setError(error.message || 'An error occurred while fetching menu items.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenuitems();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    const filteredItems = menuitems.filter((item) => {
      const searchTextLower = event.target.value.toLowerCase();
      return (
        item.itemname.toLowerCase().includes(searchTextLower) ||
        item.description.toLowerCase().includes(searchTextLower) ||
        (categories.find((c) => c.id === item.category_id)?.name?.toLowerCase().includes(searchTextLower) || '')
      );
    });
    setFilteredMenuItems(filteredItems);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditedItem({
      itemname: item.itemname,
      description: item.description,
      price: item.price,
      category_id: item.category_id,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveChanges = async () => {
    try {
        // Send a PUT request to update the item on the backend
        await axios.put(`http://localhost:5000/editmenuitem/${editingItem.id}`, editedItem);

        // Update the menuitems array with the edited item
        const updatedMenuItems = menuitems.map(item => {
            if (item.id === editingItem.id) {
                return { ...item, ...editedItem };
            }
            return item;
        });

        // Set the state with the updated array
        setMenuitems(updatedMenuItems);

        // After saving changes, close modal
        setShowModal(false);
    } catch (error) {
        console.error('Error saving changes:', error);
        // Handle any errors (e.g., display error message to user)
    }
};

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedItem(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDelete = async (itemId) => {
    try {
      // Send a DELETE request to delete the item on the backend
      await axios.delete(`http://localhost:5000/deletemenuitem/${itemId}`);
  
      // Update the menuitems array by filtering out the deleted item
      const updatedMenuItems = menuitems.filter(item => item.id !== itemId);
  
      // Set the state with the updated array
      setMenuitems(updatedMenuItems);
    } catch (error) {
      console.error('Error deleting item:', error);
      // Handle any errors (e.g., display error message to user)
    }
  };
  

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", alignContent: "center", justifyContent: "center", backgroundColor: "#f7f7f7" }}>
      <div style={{ justifyContent: "space-around", backgroundColor: "white", width: "95%", marginTop: "50px", marginBottom: "50px", borderRadius: "20PX", alignSelf: "center", padding: "50px" }}>
        <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-around", width: "90%", }}>
          <div><Category /></div>
          <div><Menuform /></div>
        </div>
        <div style={{ display: 'flex', width: '100%', height: '100%', alignContent: 'center', justifyContent: 'center', borderTopColor: "1px solid black" }}>
          <div style={{ justifyContent: 'space-around', backgroundColor: 'white', width: '95%', marginTop: '50px', marginBottom: '50px', borderRadius: '20PX', alignSelf: 'center', padding: '50px' }}>

            <input type="text" placeholder="Search menu items..." value={searchTerm} onChange={handleSearchChange} />

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Category Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMenuItems.length > 0 ? (
                  filteredMenuItems.map((items, index) => {
                    const categoryName = categories.find((category) => category.id === items.category_id)?.name; // Find category name based on ID
                    const isEven = index % 2 === 0; // Determine even/odd index
                    return (
                      <tr key={items.id} style={{ backgroundColor: isEven ? '#f2f2f2' : 'white' }}>
                          <td>{items.itemname}</td>
                          <td style={{ maxWidth: '200px',paddingRight:"10px", wordWrap: 'break-word' }}>{items.description}</td>
                          <td>{items.price}</td>
                          <td>{categoryName || 'Category not found'}</td>
                          <td>
                            <FaEdit
                              size={20}
                              style={{ cursor: 'pointer', marginRight: '10px', color: '#007bff' }}
                              onClick={() => handleEdit(items)} />
                            <MdDeleteForever
                              size={20}
                              style={{ cursor: 'pointer', color: '#dc3545' }}
                              onClick={() => handleDelete(items.id)} />
                          </td>
                        </tr>
                    );
                  })
                ) : (
                  menuitems.map((items, index) => {
                    const categoryName = categories.find((category) => category.id === items.category_id)?.name;
                    const isEven = index % 2 === 0;
                    return (
                        <tr key={items.id} style={{ backgroundColor: isEven ? '#f2f2f2' : 'white' }}>
                          <td>{items.itemname}</td>
                          <td style={{ maxWidth: '200px',paddingRight:"10px", wordWrap: 'break-word' }}>{items.description}</td>
                          <td>{items.price}</td>
                          <td>{categoryName || 'Category not found'}</td>
                          <td>
                            <FaEdit
                              size={20}
                              style={{ cursor: 'pointer', marginRight: '10px', color: '#007bff' }}
                              onClick={() => handleEdit(items)} />
                            <MdDeleteForever
                              size={20}
                              style={{ cursor: 'pointer', color: '#dc3545' }}
                              onClick={() => handleDelete(items.id)} />
                          </td>
                        </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Menu Item</Modal.Title>
              </Modal.Header>
              <Modal.Body>
  <form>
    <div className="mb-3">
      <label htmlFor="itemName" className="form-label">Item Name:</label>
      <input type="text" id="itemName" name="itemname" className="form-control" value={editedItem.itemname} onChange={handleInputChange} />
    </div>
    <div className="mb-3">
      <label htmlFor="itemDescription" className="form-label">Description:</label>
      <textarea id="itemDescription" name="description" className="form-control" value={editedItem.description} onChange={handleInputChange} />
    </div>
    <div className="mb-3">
      <label htmlFor="itemPrice" className="form-label">Price:</label>
      <input type="text" id="itemPrice" name="price" className="form-control" value={editedItem.price} onChange={handleInputChange} />
    </div>
    <div className="mb-3">
      <label htmlFor="itemCategory" className="form-label">Category:</label>
      <select id="itemCategory" name="category_id" className="form-select" value={editedItem.category_id} onChange={handleInputChange}>
        {categories.map(category => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
    </div>
  </form>
</Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
              </Modal.Footer>
            </Modal>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Adminpanel;
