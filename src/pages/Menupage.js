import React, { useState, useEffect } from 'react';
import { Button, ListGroup, Modal } from 'react-bootstrap';
import axios from 'axios';

const Menupage = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const menuItemsResponse = await axios.get('http://localhost:5000/menuitems');
                const categoriesResponse = await axios.get('http://localhost:5000/categories');
                
                const menuItems = menuItemsResponse.data;
                const categoriesData = categoriesResponse.data.reduce((acc, curr) => {
                    acc[curr.id] = curr.name;
                    return acc;
                }, {});

                setItems(menuItems);
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f7f7f7" }}>
            <div style={{ width: "80%", background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', paddingBottom: '20px', textAlign: "center", marginBottom: "40px", borderBottom: "2px solid #ddd" }}>THE FIG AND OLIVE CAFE MENU </h1>

                {Object.keys(categories).map((categoryId) => {
                    const categoryItems = items.filter(item => item.category_id === parseInt(categoryId));
                    if (categoryItems.length === 0) return null; // Skip rendering if no items in category
                    return (
                        <div key={categoryId}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', marginTop:"10px" }}>{categories[categoryId]}</h2>
                            <ListGroup>
                                {categoryItems.map((item, index) => (
                                    <ListGroup.Item
                                        key={index}
                                        onClick={() => handleItemClick(item)}
                                        style={{ borderBottom: '1px dashed #ddd', cursor: "pointer" }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontSize: '16px', fontWeight: 'bold', paddingLeft:"2px" }}>{item.itemname}</div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                <div style={{ fontSize: '16px', color: '#333', marginBottom: '5px' }}>{item.price}/=</div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '14px', fontStyle: 'italic', color: '#777', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                    );
                })}

                <Modal show={showModal} onHide={closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedItem && selectedItem.itemname}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedItem && (
                            <div>
                                <p style={{ fontStyle: 'italic', fontSize:'16px',maxWidth: '100%',paddingRight:"10px", wordWrap: 'break-word' }}>{selectedItem.description}</p>
                                {/*<p>Category: {categories[selectedItem.category_id]}</p>*/}
                                <p>Price: {selectedItem.price}</p>
                            </div>
                        )}
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default Menupage;
