import React, { useEffect, useState, useCallback } from 'react';
import DropDown from './DropDown';
import { HiArrowsRightLeft } from "react-icons/hi2";

function CurrencyConverter() {

    const [currencies, setCurrencies] = useState([]);
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("USD");
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [converting, setConverting] = useState(false);

    async function fetchCurrencies() {
        try {
            const res = await fetch("https://api.frankfurter.app/currencies");
            const data = await res.json();
            setCurrencies(Object.keys(data));
        } catch (error) {
            console.error("Error fetching currencies:", error);
        }
    }

    useEffect(() => {
        fetchCurrencies();
    }, []);

    async function convertCurrency() {
        if (!amount || amount <= 0) return;
        setConverting(true);

        try {
            const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`);
            const data = await res.json();
            setConvertedAmount(data.rates[toCurrency] + " " + toCurrency);
        } catch (error) {
            console.error("Error converting currency:", error);
        } finally {
            setConverting(false);
        }
    }

    const swapCurrencies = useCallback(() => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    }, [fromCurrency, toCurrency]);

    return (
        <div className='max-w-xl mx-auto my-10 p-5 bg-white rounded-lg shadow'>
            <h2 className='mb-5 text-2xl font-semibold text-gray-700'>Currency Converter</h2>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 items-end'>
                <DropDown
                    currencies={currencies}
                    selectedCurrency={fromCurrency}
                    onChangeCurrency={(currency) => setFromCurrency(currency)}
                    title="From:"
                />
                
                <div className='flex justify-center -mb-5 sm:mb-0'>
                    <button onClick={swapCurrencies} className='p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300'>
                        <HiArrowsRightLeft />
                    </button>
                </div>
                
                <DropDown
                    currencies={currencies}
                    selectedCurrency={toCurrency}
                    onChangeCurrency={(currency) => setToCurrency(currency)}
                    title="To:"
                />
            </div>

            <div className='mt-4'>
                <label htmlFor='amount' className='block text-sm font-medium text-gray-700'>Amount:</label>
                <input 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type='number'
                    className='w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    min="0"
                />
            </div>

            <div className='flex justify-end mt-6'>
                <button
                    onClick={convertCurrency}
                    className={`px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${converting ? "animate-pulse" : ""}`}
                    disabled={converting}
                >
                    Convert
                </button>
            </div>

            <div className='mt-4 text-lg font-medium text-right text-green-600'>
                Converted Amount: {convertedAmount || "-"}
            </div>
        </div>
    );
}

export default CurrencyConverter;
