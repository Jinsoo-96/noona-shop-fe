import React from "react";
import { currencyFormat } from "../../../utils/number";
import { Modal, Button, Table } from "react-bootstrap";
import "../style/trashModal.style.css";

const TrashModal = ({ show, onClose, deletedItems, onRestore }) => {
  const header = ["#", "Sku", "Name", "category", "Image", ""];
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Trash</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-responsive">
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
                  <td>{item.category}</td> {/* 카테고리 */}
                  <th>
                    <img
                      src={item.image}
                      width={100}
                      height={100} // height를 width와 동일하게 설정하여 정사각형 비율 유지
                      style={{ objectFit: "cover" }} // 이미지가 정사각형 영역을 채우도록 설정
                      alt="product"
                    />
                  </th>
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
