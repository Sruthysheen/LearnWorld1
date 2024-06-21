import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import { deposit, selectWalletBalance, selectWalletTransactions, setWalletData, withdraw } from "../../../Slices/studentSlice/walletSlice";
import { getBalance, getTransactions } from "../../../Utils/config/axios.GetMethods";


interface Wallet{
  _id:string;
  balance:number;
  transactions:[]
}
function StudentWallet() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const balance = useSelector(selectWalletBalance);
  // console.log(balance,"......................??????????????");
  
  // const transactions = useSelector(selectWalletTransactions);
  // console.log(transactions,",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,");
  const {student} =useSelector((state:any)=>state.student)
  const studentId = student._id

  const [balance,setBalance] = useState(0);
  const [transactions,setTransactions] = useState([])

  useEffect(() => {
    
    const fetchWalletData = async () => {
      try {
        const balanceResponse = await getBalance(studentId)
        const transactionsResponse = await getTransactions(studentId)
        const balanceData = balanceResponse.data;
        
        
        console.log(balanceData,"***********************");
        
        const transactionsData = transactionsResponse.data;

        setBalance(balanceData.balance);
        setTransactions(transactionsData.transactions);
        const walletData = {
          _id: balanceData._id,
          studentId: studentId,
          balance: balanceData.balance,
          transactions: transactionsData.transactions,
          enrollments: [],
        };
        dispatch(setWalletData(walletData))
      } catch (error) {
        toast.error('No sufficient wallet amount');
      }
    };

    fetchWalletData();
  }, [studentId,dispatch]);



  const handleDeposit = (amount:any) => {
    dispatch(deposit(amount));
    toast.success(`Deposited ${amount} successfully`);
  };
  
  const handleWithdraw = (amount:any) => {
    if (amount <= balance) {
      dispatch(withdraw(amount));
      toast.success(`Withdrew ${amount} successfully`);
    } else {
      toast.error('Insufficient balance');
    }
  };
  return (
    <>
      {/* component */}
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <nav className="bg-white border-b border-gray-300">
        <div className="flex justify-between items-center px-4">
          
          <button id="menuBtn">
            <i className="fas fa-bars text-cyan-500 text-lg" />
          </button>
      
          <div className="space-x-4">
            <button>
              <i className="fas fa-bell text-cyan-500 text-lg" />
            </button>
            <button>
              <i className="fas fa-user text-cyan-500 text-lg" />
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-5 px-4 max-w-xl">
       
        <div className="lg:flex gap-4 items-stretch">
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-4 shadow-md w-full">
            <div className="flex justify-center items-center space-x-5 h-full">
              <div>
                <h2 className="text-4xl font-bold text-sky-600">₹{balance}</h2>
              </div>
              <img
                src="/public/Wallet4.png"
                alt="wallet"
                className="h-32 w-38"
              />
            </div>
          </div>
          {/* White Box */}
          {/* <div className="bg-white p-4 rounded-lg mb-4 shadow-md w-full">
            <div className="flex flex-wrap justify-between h-full">
              <div className="flex-1 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-lg flex flex-col items-center justify-center p-4 space-y-2 border border-gray-200 m-2">
                <i className="fas fa-hand-holding-usd text-white text-4xl" />
                <p className="text-white">Depositar</p>
              </div>
              <div className="flex-1 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-lg flex flex-col items-center justify-center p-4 space-y-2 border border-gray-200 m-2">
                <i className="fas fa-exchange-alt text-white text-4xl" />
                <p className="text-white">Transferir</p>
              </div>
              <div className="flex-1 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-lg flex flex-col items-center justify-center p-4 space-y-2 border border-gray-200 m-2">
                <i className="fas fa-qrcode text-white text-4xl" />
                <p className="text-white">Canjear</p>
              </div>
            </div>
          </div> */}
        </div>
        {/* Table */}
        <div className="bg-white rounded-lg p-4 shadow-md my-4">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left border-b-2 w-full">
                  <h2 className="text-ml font-bold text-gray-600">Transactions</h2>
                </th>
              </tr>
            </thead>
            <tbody>
            {transactions.map((transaction:any, index) => (
                <tr key={index} className="border-b w-full">
                  <td className="px-4 py-2 text-left align-top w-1/2 text-gray-800">
                    <div>
                      <h2>{transaction.type}</h2>
                      <p>{format(parseISO(transaction.date), 'dd/MM/yyyy')}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right text-sky-500 w-1/2">
                    <p>
                      <span> ₹{transaction.amount} </span>
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Script */}
    </>
  );
}

export default StudentWallet;
