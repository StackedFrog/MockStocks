import React, { useEffect, useState } from 'react';
import Button from '../ui/Button.jsx'
import Modal from '../ui/Modal.jsx'
import { useApi } from '../../hooks/useApi.jsx';

const BuyingAndSelling = ({ price, symbol }) => {
  const { apiFetch } = useApi();
  const [openModal, setOpenModal] = useState(false)
  const [hideOther, setHideOther] = useState(true)
  const [isSelling, setIsSelling] = useState(false)
  const [amount, setAmount] = useState(0)

  const purchaseStock = async () => {
    try {
      //close modal
      setOpenModal(false)
      const response = await apiFetch('/api/user/purchase', {
        method: 'POST',
        body: JSON.stringify({ symbol, amount })
      });
      if (!response.ok) throw new Error("Failed to add transaction");
    } catch (err) {
      console.error(`Error when purchasing stock: ${err}`)
    }
  }

  useEffect(() => {
    console.log(amount)
  }, [amount])
const sellStock = async () => {
  try {
    setOpenModal(false);
    const response = await apiFetch('/api/user/sale', {
      method: 'POST',
      body: JSON.stringify({ symbol, amount })
    });
    if (!response.ok) throw new Error("Failed to execute sale");
  } catch (err) {
    console.error(`Error when selling stock: ${err}`);
  }
};

const setAmountAll = async () => {
  try {
    const response = await apiFetch('/api/user/info')
    const data = await response.json()
    if (!response.ok) throw new Error("Failed to execute sale");
    setAmount(Number(data.balance))
  } catch (err) {
    console.error(`Error when selling stock: ${err}`);
  }
}

  return (
    <div className="flex justify-center gap-4 mt-5">

      <Button
        text="Buy"
        onClick={() => {setOpenModal(true); setIsSelling(false)}}
      >
      </Button>
      <Button
        text="Sell"
        onClick={() => {setOpenModal(true); setIsSelling(true)}}
      >
      </Button>

      {openModal ? (
        <div className="absolute bg-secondary m-4 p-4 rounded">
          <h1>Select amount:</h1>
          <ul className="flex flex-col">
            <li className="flex gap-3">
              <Button className="bg-neutral-700 focus:bg-neutral-500"
                text="100"
                onClick={() => {setAmount(100)}} />
              <Button className="bg-neutral-700 focus:bg-neutral-500"
                text="1000"
                onClick={() => {setAmount(1000)}} />
            </li>
            <li className="flex gap-3">
              <Button className="bg-neutral-700 focus:bg-neutral-500"
                text="All"
                onClick={setAmountAll} /> 
  <button
    className="h-15 lg:w-[20vw] px-5 py-3 mx-0 my-2.5 rounded-lg font-heading text-text bg-accent flex items-center justify-center hover:bg-primary active:bg-primary cursor-pointer transition-colors duration-200"
  >

<input
  className="w-full h-full text-text text-center outline-none rounded-lg px-3 py-2"
  type="text"
  name="customNumber"
  inputMode="numeric"              
  pattern="^\d+$"                 
  placeholder="Other"
  onChange={(e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setAmount(val === "" ? 0 : Number(val));
    }
  }}

 />
  </button>
            </li>
          </ul>
          <div className="flex gap-3">
            <Button
              className="bg-accent"
              text="Confirm"
              onClick={isSelling ? sellStock : purchaseStock}>
            </Button>
            <Button
              className="bg-accent2"
              text="Cancel"
              onClick={() => {setOpenModal(false)}}>
              disabled={amount <= 0}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default BuyingAndSelling
