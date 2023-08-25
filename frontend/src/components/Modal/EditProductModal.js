import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function EditProductModal({ product, showModal, modalClose }) {
   console.log(product);
   const [show, setShow] = useState(showModal);

   const [name, setName] = useState();
   const [brand, setBrand] = useState();

   const handleInputChange = (event) => {
      console.log(event.target.name);
      console.log(event.target.name);
      console.log(event.target.value);
      if (event.target.name === 'name') {
         setName(event.target.value);
      }
      if (event.target.name === 'brand') {
         setBrand(event.target.value);
      }
   };

   const handleClose = () => {
      setShow(false);
      modalClose(false);
   };

   useEffect(() => {
      setName(product.name);
      setBrand(product.brand);
      setShow(showModal);
   }, [showModal, product]);
   const handleShow = () => setShow(true);

   const handleSave = (editedProduct) => {
      //  onSave(editedProduct);
      //  handleClose();
   };

   return (
      <div>
         {console.log(show)}{' '}
         <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
               <Modal.Title>Edit Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {/* <EditProductForm product={product} onSave={handleSave} /> */}
               <div>
                  <h2>Edit Product</h2>
                  <form>
                     <div className="mb-3">
                        <label>Name</label>
                        <input
                           type="text"
                           name="name"
                           value={name}
                           onChange={handleInputChange}
                           className="form-control"
                        />
                     </div>
                     <div className="mb-3">
                        <label>Brand</label>
                        <input
                           type="text"
                           name="brand"
                           value={brand}
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
