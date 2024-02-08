import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import Modal from 'react-bootstrap/Modal';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/addcategory', {
        name: categoryName,
      });
      setSuccessMessage(response.data);
      setCategoryName('');
      fetchCategories(); // Fetch updated categories after adding a new one
    } catch (error) {
      console.error(error);
      setErrorMessage('Category not added');
    }
  };

  const handleEdit = (categoryId) => {
    setEditingCategoryId(categoryId);
    setModalIsOpen(true);
    setCategoryName(categories.find(cat => cat.id === categoryId).name);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setEditingCategoryId(null);
    setCategoryName('');
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (!editingCategoryId) {
      console.error('No category selected for editing.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/editcategory/${editingCategoryId}`, {
        name: categoryName,
      });
      console.log(response.data);
      setModalIsOpen(false);
      setEditingCategoryId(null);
      setCategoryName('');
      fetchCategories(); // Fetch updated categories after editing
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      // Check for existing menu items
      const response = await axios.get(`http://localhost:5000/menuitems/category/${categoryId}`);
      console.log('Menu items:', response.data); // Log the menu items to understand the response
  
      if (response.data.length > 0) {
        alert('Cannot delete category with existing menu items. Please delete those items first or move them to a different category.');
        return;
      }
  
      // Proceed with deletion if no menu items are found
      const deleteResponse = await axios.delete(`http://localhost:5000/deletecategory/${categoryId}`);
      console.log('Delete response:', deleteResponse.data); // Log the delete response to understand if it's successful
  
      fetchCategories(); // Fetch updated categories after deletion
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category. Please try again.');
    }
  };   

  return (
    <div>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Add Category</Form.Label>
          <Form.Control type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Enter Category" />
        </Form.Group>
        <Button onClick={handleSubmit} variant="primary" type="submit">
          Submit Category
        </Button>
      </Form>
      <div>
        {categories.length > 0 ? (
          <div>
            {categories.map((category) => (
              <div key={category.id} style={{ display: "flex", marginTop: "10px", flexDirection: "row", alignItems: "center", justifyContent: "left" }}>
                <div style={{ width: "70%" }}>{category.name}</div>
                <div onClick={() => handleEdit(category.id)} style={{ cursor: 'pointer', marginRight: '10px', color: '#007bff' }}><FaEdit size={20} /></div>
                <div onClick={() => handleDelete(category.id)} style={{ cursor: 'pointer', color: '#dc3545' }}><MdDeleteForever size={20} /></div>
              </div>
            ))}
          </div>

        ) : (
          <p>Loading categories ....</p>
        )}
      </div>

      <Modal show={modalIsOpen} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitEdit}>
            <Form.Group className="mb-3" controlId="editCategoryForm">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

    </div>
  )
}

export default Category;
