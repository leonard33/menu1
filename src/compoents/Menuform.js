import React, {useState, useEffect} from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const Menuform = () => {

    const [formData, setFormData] = useState({
        itemname: '',
        description: '',
        price: '',
        category_id: '',
      });

      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState(null);
      const [categories, setCategories] = useState([]);

      useEffect(() => {
        const fetchCategories = async () => {
          try {
            const response = await axios.get('http://localhost:5000/categories');
            setCategories(response.data);
          } catch (error) {
            console.error('Error fetching categories:', error);
          }
        };
      
        fetchCategories();
      }, []);

      const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Perform basic validation (optional)
        let isValid = true;
        if (!formData.itemname) {
          isValid = false;
          setError('Please enter an item name.');
        }
        // Add more validation rules as needed
    
        if (!isValid) {
          return;
        }
    
        setIsLoading(true);
        setError(null);
    
        try {
          const response = await axios.post('http://localhost:5000/addmenuitem', formData);
    
          // Handle successful response (e.g., display success message, clear form)
          console.log('Menu item added successfully:', response.data);
          setFormData({ itemname: '', description: '', price: '', category_id: '' }); // Clear form
        } catch (error) {
          console.error('Error adding menu item:', error);
          setError(error.message || 'An error occurred while adding the menu item.');
        } finally {
          setIsLoading(false);
        }
      };
    

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Add menu item:</Form.Label>
          <Form.Control
            type="text"
            name="itemname"
            value={formData.itemname}
            onChange={handleChange}
            placeholder="Menu item name"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
         <Form.Control
          as="textarea"
          rows={5}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            step="0.01"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        {error && <p className="error">{error}</p>}
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </Form>
    </div>
  )
}

export default Menuform
