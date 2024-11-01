import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";
import { resolvePath } from "react-router";

// 비동기 액션 생성
export const getProductList = createAsyncThunk(
  "products/getProductList",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get("/product", { params: { ...query } });
      if (response.status !== 200) throw new Error(response.error);
      console.log("여기", response.data);
      return response.data; // 백엔드에서 어떻게 보냈는지 필히 확인하시오!
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, { rejectWithValue }) => {}
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/product", formData);
      if (response.status !== 200) throw new Error(response.error);
      dispatch(
        showToastMessage({ message: "상품 생성 완료", status: "success" })
      );
      // 무조건 1이여도 상관없는게, 추가한게 맨 위로 보이게 할 것이기 때문
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/product/${id}`);
      if (response.status !== 200) throw new Error(response.error);
      dispatch(
        showToastMessage({
          message: "상품 정보가 삭제되었습니다.",
          status: "info",
        })
      );
      return id; // 굳이 필요한지 모르겠음
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, ...formData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/product/${id}`, formData);
      if (response.status !== 200) throw new Error(response.error);
      dispatch(
        showToastMessage({
          message: "상품 정보가 업데이트 되었습니다.",
          status: "success",
        })
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

// 휴지통 기능
export const getDeletedProducts = createAsyncThunk(
  "products/getDeleted",
  async () => {
    const response = await api.get("/product/deleted", {
      params: { isDeleted: true },
    });
    console.log(response.data);
    return response.data;
  }
);

export const restoreProduct = createAsyncThunk(
  "products/restoreProduct",
  async (id) => {
    const response = await api.put(`/product/restore/${id}`, {
      isDeleted: false,
    });
    return response.data;
  }
);

// 슬라이스 생성
const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    filteredList: [], // 초기 상태에 추가 -> 잘 모르겠음
    deletedItems: [], // 삭제된 항목 상태 추가
    selectedProduct: null,
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 상품 생성
      .addCase(createProduct.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.success = true; // 상품 생성을 성공했다? 다이얼로그를 닫고, 실패? 실패메세지를 다이어로그에 보여주고, 닫진 않음.
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // 정보 get
      .addCase(getProductList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = action.payload.data;
        state.totalPageNum = action.payload.totalPageNum;
        state.error = "";
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 상품 삭제
      .addCase(deleteProduct.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        console.log("여기", action.payload);
        state.productList = state.productList.filter(
          (product) => product._id !== action.payload
        );
        state.success = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //상품 수정
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = "";
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      //휴지통
      // .addCase(getProductList.fulfilled, (state, action) => {
      //   state.productList = action.payload.data;
      //   state.totalPageNum = action.payload.totalPageNum;
      // })
      .addCase(getDeletedProducts.fulfilled, (state, action) => {
        state.deletedItems = action.payload.data; // 삭제된 항목 업데이트
      })
      .addCase(restoreProduct.fulfilled, (state, action) => {
        state.deletedItems = state.deletedItems.filter(
          (item) => item._id !== action.payload._id
        );
      });
  },
});

export const { setSelectedProduct, setFilteredList, clearError } =
  productSlice.actions;
export default productSlice.reducer;
