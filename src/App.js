import React,{useState, useEffect} from 'react'
import './App.css';
import CurrencyRow from './components/CurrencyRow';
import Footer from './components/Footer';

const BASE_URL = "https://api.coinbase.com/v2/exchange-rates"

export default function App() {
  const [currencyOptions,setCurrencyOptions] = useState([])
  const [fromCurrency,setFromCurrency] = useState()
  const [toCurrency,setToCurrency] = useState()
  const [exchangeRate,setExchangeRate] = useState()
  const [amount,setAmount] = useState(1)
  const [amountInFromCurrency,setAmountInFromCurrency] = useState(true)
  
  let fromAmount, toAmount
  if(amountInFromCurrency){
    fromAmount = amount
    toAmount = parseFloat((amount*exchangeRate).toFixed(5))
  } else {
    toAmount = amount
    fromAmount = parseFloat((amount/exchangeRate).toFixed(5))
  }

  useEffect(() => {
    fetch(BASE_URL)
    .then(res => res.json())
    .then(exchange => {
      const currencies = Object.keys(exchange.data.rates)
      setCurrencyOptions([...currencies]) 
      setFromCurrency(exchange.data.currency)
      setToCurrency(currencies[1])
      setExchangeRate(exchange.data.rates[currencies[0]])
    })
  },[])

  useEffect(() => {
    if(fromCurrency != null && toCurrency != null){
      fetch(`${BASE_URL}?currency=${fromCurrency}`)
      .then(res => res.json())
      .then(exchange => setExchangeRate(exchange.data.rates[toCurrency]))
    }
  },[fromCurrency,toCurrency])

  function handleFromAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <>
      <h1>Currency Convertor</h1>
      <CurrencyRow currencyOptions={currencyOptions} selectedCurrency={fromCurrency} onChangeCurrency={e => setFromCurrency(e.target.value)} amount={fromAmount} onChangeAmount={handleFromAmountChange}/>
      <div className="equals"> = </div>
      <CurrencyRow currencyOptions={currencyOptions} selectedCurrency={toCurrency} onChangeCurrency={e => setToCurrency(e.target.value)} amount={toAmount} onChangeAmount={handleToAmountChange}/>
      <Footer></Footer>
    </>
  )
}
