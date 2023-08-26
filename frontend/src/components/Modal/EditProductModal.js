import { doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { db } from '../../config/firebase';
import { toast } from 'react-toastify';

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

   const handleSave = async () => {
      console.log(editedProduct);
      const productRef = doc(db, 'product', editedProduct.id);

      try {
         await updateDoc(productRef, editedProduct);
         toast.success('Product updated successfully');
         handleClose();
      } catch (error) {
         console.log(error.message);
         toast.error('Cannot update product', error.message);
      }
   };

   return (
      <div>
         {console.log(show)}
         {console.log(editedProduct)}
         <Modal show={show} onHide={handleClose} scrollable>
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
                        <div className="mb-3">
                           <label>Category</label>
                           <input
                              type="text"
                              name="category"
                              value={editedProduct.category}
                              onChange={handleInputChange}
                              className="form-control"
                           />
                        </div>
                        <div className="mb-3">
                           <label>Description</label>
                           <input
                              type="text"
                              name="description"
                              value={editedProduct.description}
                              onChange={handleInputChange}
                              className="form-control"
                           />
                        </div>
                        <div className="mb-3">
                           <label>Note</label>
                           <input
                              type="text"
                              name="Note"
                              value={editedProduct.Note}
                              onChange={handleInputChange}
                              className="form-control"
                           />
                        </div>
                        <div className="mb-3">
                           <label>Rating</label>
                           <input
                              type="text"
                              name="ratings"
                              value={editedProduct.ratings}
                              onChange={handleInputChange}
                              className="form-control"
                           />
                        </div>
                        <div className="mb-3">
                           <label>Size</label>
                           <input
                              type="text"
                              name="size"
                              value={editedProduct.size}
                              onChange={handleInputChange}
                              className="form-control"
                           />
                        </div>
                        <div className="mb-3">
                           <label>Unit</label>
                           <input
                              type="text"
                              name="unit"
                              value={editedProduct.unit}
                              onChange={handleInputChange}
                              className="form-control"
                           />
                        </div>
                        <div className="mb-3">
                           <label>slug</label>
                           <input
                              type="text"
                              name="slug"
                              value={editedProduct.slug}
                              onChange={handleInputChange}
                              className="form-control"
                           />
                        </div>
                        {/* Add other input fields for category, description, note, image, slug, size, unit, and rating */}
                     </form>
                  }
               </div>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="primary" onClick={handleSave}>
                  {' '}
                  Save{' '}
               </Button>
               <Button variant="secondary" onClick={handleClose}>
                  Close
               </Button>
            </Modal.Footer>
         </Modal>
      </div>
   );
}

export default EditProductModal;
