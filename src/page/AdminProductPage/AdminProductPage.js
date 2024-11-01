import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import SearchBox from "../../common/component/SearchBox";
import NewItemDialog from "./component/NewItemDialog";
import ProductTable from "./component/ProductTable";
// 휴지통 기능
import TrashModal from "./component/TrashModal"; // 새로 만든 TrashModal 컴포넌트를 임포트
import {
  getProductList,
  deleteProduct,
  setSelectedProduct,
  getDeletedProducts,
  restoreProduct,
} from "../../features/product/productSlice";

const AdminProductPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const { productList, totalPageNum } = useSelector((state) => state.product);
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  }); //검색 조건들을 저장하는 객체

  const [mode, setMode] = useState("new");

  const tableHeader = [
    "#",
    "Sku",
    "Name",
    "Price",
    "Stock",
    "Image",
    "Status",
    "",
  ];

  //상품리스트 가져오기 (url쿼리 맞춰서)
  useEffect(() => {
    dispatch(getProductList({ ...searchQuery }));
  }, [query]);

  useEffect(() => {
    //검색어나 페이지가 바뀌면 url바꿔주기 (검색어또는 페이지가 바뀜 => url 바꿔줌=> url쿼리 읽어옴=> 이 쿼리값 맞춰서  상품리스트 가져오기)
    if (searchQuery.name === "") {
      delete searchQuery.name;
    }
    const params = new URLSearchParams(searchQuery);
    const query = params.toString();
    navigate("?" + query);
  }, [searchQuery]);

  useEffect(() => {
    // 현재 페이지가 totalPageNum을 초과할 경우 마지막 페이지로 리다이렉트
    if (searchQuery.page > totalPageNum) {
      setSearchQuery((prevQuery) => ({ ...prevQuery, page: totalPageNum }));
    }
  }, [totalPageNum, searchQuery.page]);

  const deleteItem = async (id) => {
    //아이템 삭제하가ㅣ
    await dispatch(deleteProduct(id)); // await 안했을때 문제 생김
    dispatch(getProductList({ ...searchQuery }));
  };

  const openEditForm = (product) => {
    //edit모드로 설정하고
    // 아이템 수정다이얼로그 열어주기
    setMode("edit");
    dispatch(setSelectedProduct(product));
    setShowDialog(true);
  };

  const handleClickNewItem = () => {
    //new 모드로 설정하고
    setMode("new");
    // 다이얼로그 열어주기
    setShowDialog(true);
  };

  const handlePageClick = ({ selected }) => {
    //  쿼리에 페이지값 바꿔주기
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };
  // searchbox에서 검색어를 읽어온다. => 엔터를 치면 => searchQuery객체가 업데이트가 됨. {name: 스트레이트 팬츠}
  // => searchQuery객체 안에 아이템 기준으로 url을 새로 생성해서 호출 &name=스트레이트+팬츠
  // => url쿼리 읽어오기 => url쿼리 기준으로 BE에 검색조건과 함께 호출한다.

  // 휴지통 기능 만들어보기
  const { deletedItems } = useSelector((state) => state.product); // Redux에서 삭제된 항목 가져오기
  const [showTrashModal, setShowTrashModal] = useState(false);

  const openTrash = async () => {
    setShowTrashModal(true);
    await dispatch(getDeletedProducts());
  };

  const closeTrash = () => {
    setShowTrashModal(false);
  };

  const handleRestore = async (id) => {
    await dispatch(restoreProduct(id));
    await dispatch(getProductList({ page: 1 }));
    await setSearchQuery({ page: 1 }); // 복구 후 목록 새로고침
    await dispatch(getDeletedProducts()); // 삭제된 항목 목록 새로 고침
  };

  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="제품 이름으로 검색"
            field="name"
          />
        </div>
        <div className="d-flex justify-content-between align-items-center mt-0 mb-0">
          <Button className="mt-2 mb-2" onClick={handleClickNewItem}>
            Add New Item +
          </Button>

          <Button
            variant="outline-secondary"
            className="mt-2 mb-2"
            onClick={openTrash}
          >
            🗑️ Trash
          </Button>
        </div>

        <ProductTable
          header={tableHeader}
          data={productList}
          deleteItem={deleteItem}
          openEditForm={openEditForm}
        />
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPageNum} // 전체 페이지
          forcePage={searchQuery.page - 1} // 1페이지면 2임 여긴 한개씩 +1 해야함 {}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          className="display-center list-style-none"
        />
      </Container>

      <NewItemDialog
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        setSearchQuery={setSearchQuery}
      />
      {/* Trash Modal */}
      <TrashModal
        header={tableHeader}
        show={showTrashModal}
        onClose={closeTrash}
        deletedItems={deletedItems}
        onRestore={handleRestore}
      />
    </div>
  );
};

export default AdminProductPage;
