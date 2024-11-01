import React from "react";
import { currencyFormat } from "../../../utils/number";
import { Modal, Button, Table } from "react-bootstrap";

const TrashModal = ({ header, show, onClose, deletedItems, onRestore }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Trash</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              {header.map((title, index) => (
                <th key={index}>{title}</th> // 헤더 배열을 사용하여 동적으로 헤더 생성
              ))}
            </tr>
          </thead>
          <tbody>
            {deletedItems.length > 0 ? (
              deletedItems.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td> {/* 인덱스 열 */}
                  <td>{item.sku}</td> {/* SKU */}
                  <td>{item.name}</td> {/* 이름 */}
                  <th>{currencyFormat(item.price)}</th>
                  <th>
                    {Object.keys(item.stock).map((size, index) => (
                      <div key={index}>
                        {size}:{item.stock[size]}
                      </div>
                    ))}
                  </th>
                  <th>
                    <img src={item.image} width={100} alt="image" />
                  </th>
                  <th>{item.status}</th>
                  <td>
                    <Button
                      variant="outline-success"
                      onClick={() => onRestore(item._id)}
                    >
                      Restore
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={header.length} className="text-center">
                  No items in trash
                </td>
              </tr>
            )}
          </tbody>
        </Table>
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
