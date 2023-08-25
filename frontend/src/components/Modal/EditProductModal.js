import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function EditProductModal({ product, showModal, modalClose }) {
  const [show, setShow] = useState();

  const [editedProduct, setEditedProduct] = useState(product);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  const handleClose = () => {
    setShow(false);
    modalClose(false);
  };

  useEffect(() => {
    setEditedProduct(product);
    setShow(showModal);
  }, [showModal, product]);

  // const handleShow = () => setShow(true);

  const handleSave = () => {
    console.log(editedProduct);
  };

  return (
    <div>
      {console.log(show)}
      {console.log(editedProduct)}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <EditProductForm product={product} onSave={handleSave} /> */}
          <div>
            {
              <form>
                <div className="mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editedProduct.name}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label>Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={editedProduct.brand}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                {/* Add other input fields for category, description, note, image, slug, size, unit, and rating */}
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn btn-primary"
                >
                  Save
                </button>
              </form>
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EditProductModal;
