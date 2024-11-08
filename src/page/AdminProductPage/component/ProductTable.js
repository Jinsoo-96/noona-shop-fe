import React from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import "../style/productTable.style.css";
import { currencyFormat } from "../../../utils/number";

const ProductTable = ({ header, data = [], deleteItem, openEditForm }) => {
  return (
    <div className="overflow-x">
      <Table striped bordered hover>
        <thead>
          <tr>
            {header.map((title, index) => (
              <th key={index} className={`header-${index}`}>
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <th className="header-0">{index}</th>
                <th className="header-1">{item.sku}</th>
                <th className="header-2">{item.name}</th>
                <th className="header-3">{item.category}</th>
                <th className="header-4">{currencyFormat(item.price)}</th>
                <th className="header-5">
                  {Object.keys(item.stock).map((size, index) => (
                    <div key={index}>
                      {size}:{item.stock[size]}
                    </div>
                  ))}
                </th>
                <th className="header-6">
                  <img
                    src={item.image}
                    width={100}
                    height={100} // height를 width와 동일하게 설정하여 정사각형 비율 유지
                    style={{ objectFit: "cover" }} // 이미지가 정사각형 영역을 채우도록 설정
                    alt="product"
                  />
                </th>
                <th className="header-7">{item.status}</th>
                <th className="header-8">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteItem(item._id)}
                    className="mr-1"
                  >
                    -
                  </Button>
                  <Button size="sm" onClick={() => openEditForm(item)}>
                    Edit
                  </Button>
                </th>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={header.length} className="text-center">
                No Data to show
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};
export default ProductTable;
