import React, { useEffect, useState } from 'react';
import Button from '../ui/Button.jsx'
import Modal from '../ui/Modal.jsx'
import { useApi } from '../../hooks/useApi.jsx';

const BuyingAndSelling = ({ price }) => {
  const { apiFetch } = useApi();
  const [openModal, setOpenModal] = useState(false)
  const [amount, setAmount] = useState(0)

  const purchaseStock = () => {
    setOpenModal(false)

    
    

  }

  const postNewTrade = async (price, amount, userId, symbol, transactionTyp, quantity)

  const sell = () => {}

  return (
    <div className="flex justify-center gap-4 mt-5">

      <Button
        text="Buy"
        onClick={() => {setOpenModal(true)}}
      >
      </Button>
      <Button
        text="Sell"
        onClick={sell}
      >
      </Button>

      {openModal ? (
        <div className="absolute bg-secondary m-4 p-4 rounded">
          <h1>Select amount:</h1>
          <input
            className="bg-tertiary"
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <Button
            text="Confirm"
            onClick={purchaseStock}>
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default BuyingAndSelling
