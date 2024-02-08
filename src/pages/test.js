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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
            <div style={{ width: "80%" }}>
                <p style={{ fontSize: '18px', fontWeight: 'bold', paddingBottom: '20px', textAlign: "center" }}>Menu Coming Up</p>

                {Object.keys(categories).map((categoryId) => (
                    <div key={categoryId}>
                        <h2>{categories[categoryId]}</h2>
                        <ListGroup>
                            {items.filter(item => item.category_id === parseInt(categoryId)).map((item, index) => (
                                <ListGroup.Item
                                    key={index}
                                    onClick={() => handleItemClick(item)}
                                    style={{ borderBottom: '1px dashed #000' }}
                                >
                                  <div style={{display: 'flex', justifyContent: 'space-between',alignItems: 'center',}}>
                                    <div>
                                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{item.itemname}</div>
                                        {/* <div style={{ fontStyle: 'italic' }}>{item.description}</div>*/}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <div style={{ fontSize: '14px', color: '#777', marginBottom: '5px' }}>{categories[item.category_id]}</div>
                                        <div>{item.price}</div>
                                    </div>
                                    </div>
                                    <div>
                                       <div style={{ fontStyle: 'italic', fontSize:'12px',maxWidth: '100%',paddingRight:"10px", wordWrap: 'break-word' }}>{item.description}</div>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                ))}

                <Modal show={showModal} onHide={closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedItem && selectedItem.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedItem && (
                            <div>
                                <p>Description: {selectedItem.description}</p>
                               {/* <p>Category: {categories[selectedItem.category_id]}</p>
                                <p>Price: {selectedItem.price}</p>*/}
                            </div>
                        )}
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default Menupage;
