import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSVLink, CSVDownload } from "react-csv";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const DashFinance = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [financeData, setFinanceData] = useState([]);
  const [yearFilter, setYearFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [loading, setLoading] = useState({
    fetch: true,
    submit: false
  });
  const [newFinance, setNewFinance] = useState({
    descriptin: '',
    income: '',
    type: 'income',
    userId: currentUser._id
  });



  // Safe number formatting function
  const formatCurrency = (value) => {
    const num = typeof value === 'number' ? value : parseFloat(value) || 0;
    return num.toLocaleString('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Calculate totals safely
  const totalIncome = financeData
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + (Number(item.income) || 0), 0);

  const totalExpenses = financeData
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + (Number(item.income) || 0), 0);

  const totalBalance = financeData
    .filter(item => item.type === 'balance')
    .reduce((sum, item) => sum + (Number(item.income) || 0), 0);


  const profit = totalIncome - totalExpenses;

  // Fetch finance data
  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(prev => ({ ...prev, fetch: true }));
        const response = await axios.get('/api/finance');

        if (response.data && Array.isArray(response.data)) {
          // Ensure amounts are numbers
          const formattedData = response.data.map(item => ({
            ...item,
            income: Number(item.income) || 0
          }));
          setFinanceData(formattedData);
        } else {
          throw new Error('Invalid data format received from server');
        }
      } catch (err) {
        console.error('API Error:', err);
        toast.error(err.response?.data?.message || 'Failed to load financial data');
      } finally {
        setLoading(prev => ({ ...prev, fetch: false }));
      }
    };

    fetchFinanceData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFinance({
      ...newFinance,
      [name]: name === 'amount' ? value.replace(/[^0-9.]/g, '') : value,
    });
  };

  const addFinanceEntry = async () => {
    if (!newFinance.descriptin || !newFinance.income) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, submit: true }));
      const income = parseFloat(newFinance.income);
      if (isNaN(income)) {
        throw new Error('Invalid amount value');
      }

      const response = await axios.post('/api/finance', {
        ...newFinance,
        income: income,
        userId: currentUser._id
      });

      setFinanceData([{
        ...response.data,
        income: Number(response.data.income) || 0
      }, ...financeData]);

      setNewFinance({
        descriptin: '',
        income: '',
        type: 'income',
        userId: currentUser._id
      });
      toast.success(`${newFinance.type === 'income' ? 'Income' : 'Expense'} record added successfully!`);
    } catch (err) {
      console.error('Submission Error:', err);
      toast.error(err.response?.data?.message || 'Failed to add new record');
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  if (loading.fetch && financeData.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar variant="default" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading financial data...</p>
          </div>
        </div>
      </div>
    );
  }
  const filteredData = financeData.filter((item) => {
    const itemDate = new Date(item.createAt);
    const matchesYear = yearFilter ? itemDate.getFullYear().toString() === yearFilter : true;
    const matchesMonth = monthFilter ? (itemDate.getMonth() + 1).toString() === monthFilter : true;
    const matchesDateRange = startDate && endDate ? (itemDate >= startDate && itemDate <= endDate) : true;

    return matchesYear && matchesMonth && matchesDateRange;
  });

  const csvData = [
    ["Type", "Discription", "Amount", "Date"],
    ...financeData.map(item => [
      item.type,
      item.descriptin || 'No descriptin',
      item.income,
      new Date(item.createAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    ])
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <Sidebar variant="default" />
      <div className="flex-1 overflow-auto p-6">
        <h1 className='text-center p-4 text-2xl font-bold'>Finance Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg shadow border-l-4 border-blue-400">
            <h2 className="text-lg font-semibold text-blue-800">Total Income</h2>
            <p className="text-2xl font-bold text-blue-600">
              ₹{formatCurrency(totalIncome)}
            </p>
            <p className="text-xs text-blue-500 mt-1">
              {financeData.filter(item => item.type === 'income').length} records
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg shadow border-l-4 border-red-400">
            <h2 className="text-lg font-semibold text-red-800">Total Expenses</h2>
            <p className="text-2xl font-bold text-red-600">
              ₹{formatCurrency(totalExpenses)}
            </p>
            <p className="text-xs text-red-500 mt-1">
              {financeData.filter(item => item.type === 'expense').length} records
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow border-l-4 border-blue-400">
            <h2 className="text-lg font-semibold text-blue-800">Total Balance</h2>
            <p className="text-2xl font-bold text-blue-600">
              ₹{formatCurrency(totalBalance)}
            </p>
            <p className="text-xs text-blue-500 mt-1">
              {financeData.filter(item => item.type === 'balance').length} records
            </p>
          </div>

          <div className={`p-4 rounded-lg shadow border-l-4 ${profit >= 0 ? 'bg-green-50 border-green-400' : 'bg-green-500 border-yellow-400'
            }`}>
            <h2 className="text-lg font-semibold text-green-600">Net Profit</h2>
            <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-yellow-600'
              }`}>
              ₹{formatCurrency(profit)}
            </p>
            <p className={`text-xs mt-1 ${profit >= 0 ? 'text-green-500' : 'text-yellow-500'
              }`}>
              {profit >= 0 ? 'Positive' : 'Negative'} balance
            </p>
          </div>

        </div>


        {/* Add Transaction Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Transaction
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type*</label>
              <select
                name="type"
                value={newFinance.type}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="balance">Balance</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
              <input
                type="text"
                name="descriptin"
                value={newFinance.descriptin}
                onChange={handleInputChange}
                placeholder={newFinance.type === 'income' ? "Salary, Freelance, etc." : "Rent, Supplies, etc."}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500"

              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)*</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                <input
                  type="text"
                  name="income"
                  value={newFinance.income}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full pl-8 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  inputMode="decimal"
                  required
                />
              </div>
            </div>
          </div>
          <button
            onClick={addFinanceEntry}
            disabled={loading.submit || !newFinance.descriptin || !newFinance.income}
            className={`mt-4 flex items-center justify-center px-4 py-2 rounded text-white ${loading.submit || !newFinance.descriptin || !newFinance.income
              ? 'bg-gray-400 cursor-not-allowed'
              : newFinance.type === 'income'
                ? 'bg-green-500 hover:bg-green-600'
                : newFinance.type === 'balance'
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
          >
            {loading.submit ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : `Add ${newFinance.type === 'income' ? 'Income' : newFinance.type === 'expence' ? 'Expense' : 'Balance'}`}
          </button>
        </div>

        {/* Transaction History */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Transaction History
            </h2>
            <div className='flex items-center space-x-4'>

              <div className="flex flex-wrap gap-4 mb-6">
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="">All Years</option>
                  {[...new Set(financeData.map(item => new Date(item.createAt).getFullYear()))].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>

                <select
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="">All Months</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>{new Date(0, month - 1).toLocaleString('default', { month: 'long' })}</option>
                  ))}
                </select>

                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  isClearable={true}
                  placeholderText="Custom Date Range"
                  className="p-2 border rounded"
                />
                <CSVLink data={filteredData} filename='CodeNtraaFinanceReport.csv' className='bg-green-500 px-4 py-2 text-white rounded-md font-semibold'>Download Report</CSVLink>

                <button
                  onClick={() => {
                    setYearFilter('');
                    setMonthFilter('');
                    setDateRange([null, null]);
                  }}
                  className="p-2 bg-gray-200 rounded"
                >
                  Reset Filters
                </button>
                <p className="text-sm text-gray-500 text-center">Showing {financeData.length} records</p>

              </div>

            </div>
          </div>

          {financeData.length === 0 ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2 text-gray-500">No transactions yet</p>
              <p className="text-sm text-gray-400">Add your first transaction using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {financeData.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ₹{
                          item.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.descriptin || 'No descriptin'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-bold ₹{
                          item.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.type === 'income' ? '+' : '-'}₹{formatCurrency(item.income)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(item.createAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashFinance;  