import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
}

interface Enrollment {
  _id: string;
  courseId: string;
  date: string;
  refunded: boolean;
}

interface WalletState {
  _id: string;
  studentId: string;
  balance: number;
  transactions: Transaction[];
  enrollments: Enrollment[];
}

const initialState: WalletState = {
  _id: "",
  studentId: "",
  balance: 0,
  transactions: [],
  enrollments: [],
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    deposit: (state, action: PayloadAction<number>) => {
      state.balance += action.payload;
      state.transactions.push({
        id: state.transactions.length + 1,
        type: 'Deposit',
        date: new Date().toISOString(),
        amount: action.payload,
      });
    },
    withdraw: (state, action: PayloadAction<number>) => {
      state.balance -= action.payload;
      state.transactions.push({
        id: state.transactions.length + 1,
        type: 'Withdraw',
        date: new Date().toISOString(),
        amount: action.payload,
      });
    },
    
    setWalletData: (state, action: PayloadAction<WalletState>) => {
      state._id = action.payload._id;
      state.studentId = action.payload.studentId;
      state.balance = action.payload.balance;
      state.transactions = action.payload.transactions;
      state.enrollments = action.payload.enrollments;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
  },
});

export const { deposit, withdraw, setWalletData, setBalance} = walletSlice.actions;

export const selectWalletBalance = (state: { wallet: WalletState }) => state.wallet.balance;
export const selectWalletTransactions = (state: { wallet: WalletState }) => state.wallet.transactions;
export const selectWalletEnrollments = (state: { wallet: WalletState }) => state.wallet.enrollments;

export default walletSlice.reducer;
