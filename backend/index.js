const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors');


//db connection
const db = mysql.createConnection({
    host:"localhost",
    user: "root",
    password:"",
    database:'MENU'
})

//connect to sql
db.connect(err => {
    if(err){
        throw err
    }else {
        console.log('mysql connected');
    }
})

const app = express()
app.use(cors({ origin: ['http://localhost:3000'] }));
app.use(bodyParser.json());

//create db
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE MENU'
    db.query(sql, err => {
        if(err){
            throw err
        }else {
            res.send('Database created')
        }
    })
})

app.get('/createtablecategory', (req, res) => {
    let sql = 'CREATE TABLE category(id INT AUTO_INCREMENT, name VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, err => {
        if(err){
            throw err
        }else {
            res.send('table category created')
        }
    })
})

app.get('/createtablemenuitems', (req, res) => {
    let sql = 'CREATE TABLE menuitems (id INT AUTO_INCREMENT, itemname VARCHAR(255), description VARCHAR(255), price VARCHAR(255), category_id INT, PRIMARY KEY(id), FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE)';
    db.query(sql, err => {
        if(err){
            throw err
        }else {
            res.send('table menu items created')
        }
    })
})

//add data in category table
app.post('/addcategory', (req, res) => {
    const {name} = req.body;
    const sql = 'INSERT INTO category (name) VALUES (?)';
    db.query(sql, [name], (err, result) => {
    if(err){
        throw err
    }else {
        res.send('category added successfully')
    }
  })
})

// get all categories
app.get('/categories', (req, res) => {
    const sql = 'SELECT * FROM category';
    db.query(sql, (err, categories)  => {
        if(err){
            throw err
        }else {
            res.json(categories)
        }
    })
})

//edit category
app.put('/editcategory/:id', (req, res) => {
    const categoryid = req.params.id;
    const { name } = req.body;
    const sql = 'UPDATE category SET name = ? WHERE id = ?';
    
    db.query(sql, [name, categoryid], (err, result) => {
        if (err) {
            throw err;
        } else {
            res.send(`category ${name} updated successfully`);
        }
    });
});

//delete a category
app.delete('/deletecategory/:id', (req, res) => {
    const categoryId = req.params.id;
    const deleteCategoryQuery = 'DELETE FROM category WHERE id = ?';
    const deleteMenuItemsQuery = 'DELETE FROM menuitems WHERE categoryId = ?';

    db.beginTransaction((err) => {
        if (err) {
            res.status(500).json({ message: 'Error beginning transaction' });
            throw err;
        }

        db.query(deleteMenuItemsQuery, [categoryId], (err, result) => {
            if (err) {
                db.rollback(() => {
                    res.status(500).json({ message: 'Error deleting associated menu items' });
                });
                throw err;
            }

            db.query(deleteCategoryQuery, [categoryId], (err, result) => {
                if (err) {
                    db.rollback(() => {
                        res.status(500).json({ message: 'Error deleting category' });
                    });
                    throw err;
                }

                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            res.status(500).json({ message: 'Error committing transaction' });
                        });
                        throw err;
                    }
                    
                    res.status(200).json({ message: 'Category and associated menu items deleted successfully' });
                });
            });
        });
    });
});


//menu items APIs
//add menu item
app.post('/addmenuitem', (req, res) => {
    const {itemname, description, price, category_id} = req.body;
    const sql = 'INSERT INTO menuitems(itemname, description, price, category_id) VALUES(?,?,?,?)';
    db.query(sql, [itemname, description, price, category_id], (err, result) => {
        if(err){
            throw err
        }else {
            res.send('Menu item added successfully');
        }
    })
})

//get all items inmenu
app.get('/menuitems', (req, res) => {
    const sql = 'SELECT * FROM menuitems';
    db.query(sql, (err, menuitems) => {
        if(err){
            throw err
        }else {
            res.json(menuitems)
        }
    })
})

// Edit a menu item
app.put('/editmenuitem/:id', (req, res) => {
    const menuItemId = req.params.id;
    const { itemname, description, price, category_id } = req.body;
    const sql = 'UPDATE menuitems SET itemname = ?, description = ?, price = ?, category_id = ? WHERE id = ?';
    
    db.query(sql, [itemname, description, price, category_id, menuItemId], (err, result) => {
        if (err) {
            throw err;
        } else {
            res.send(`Menu item ${itemname} updated successfully`);
        }
    });
});

//delete menu item
app.delete('/deletemenuitem/:id',(req, res) => {
    const menuItemId = req.params.id;
    const sql = 'DELETE FROM menuitems WHERE id = ?';
    db.query(sql, [menuItemId], (err, result) => {
        if(err){
            throw err
        }else {
            res.send('menu item deleted successfuly')
        }
    }) 
})

app.listen('5000', () => {
    console.log('server started on port 5000')
})
