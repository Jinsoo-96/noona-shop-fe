import React from "react";
import { Modal, Button } from "react-bootstrap";

const TrashModal = ({ show, onClose, deletedItems, onRestore }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Trash</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {deletedItems.length > 0 ? (
          deletedItems.map((item) => (
            <div
              key={item._id}
              className="d-flex justify-content-between align-items-center mb-2"
            >
              <span>{item.name}</span>
              <Button
                variant="outline-success"
                onClick={() => onRestore(item._id)}
              >
                Restore
              </Button>
            </div>
          ))
        ) : (
          <p>No items in trash</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TrashModal;
