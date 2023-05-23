import React, { useState } from 'react';

const products = [
  { name: 'Product A', price: 20 },
  { name: 'Product B', price: 40 },
  { name: 'Product C', price: 50 }
];

const App = () => {
  const [quantities, setQuantities] = useState({});
  const [giftWraps, setGiftWraps] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [discountName, setDiscountName] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [giftWrapFee, setGiftWrapFee] = useState(0);
  const [total, setTotal] = useState(0);

  const handleQuantityChange = (productName, quantity) => {
    const newQuantities = { ...quantities, [productName]: quantity };
    setQuantities(newQuantities);
    calculateTotal(newQuantities, giftWraps);
  };

  const handleGiftWrapChange = (productName, isGiftWrapped) => {
    const newGiftWraps = { ...giftWraps, [productName]: isGiftWrapped };
    setGiftWraps(newGiftWraps);
    calculateTotal(quantities, newGiftWraps);
  };

  const calculateTotal = (newQuantities, newGiftWraps) => {
    let newSubtotal = 0;
    let newDiscountName = '';
    let newDiscountAmount = 0;

    for (const productName in newQuantities) {
      const quantity = newQuantities[productName];
      const product = products.find((p) => p.name === productName);
      const price = product.price;
      const isGiftWrapped = newGiftWraps[productName];

      newSubtotal += quantity * price;

      if (quantity > 10) {
        newDiscountName = 'bulk_5_discount';
        newDiscountAmount = price * quantity * 0.05;
      }

      else if (quantity > 20) {
        newDiscountName = 'bulk_10_discount';
        newDiscountAmount = newSubtotal * 0.1;
      }

      else if (quantity > 30) {
        newDiscountName = 'tiered_50_discount';
        newDiscountAmount = price * (quantity - 15) * 0.5;
      }

      else if (newSubtotal > 200 && newDiscountName === '') {
        newDiscountName = 'flat_10_discount';
        newDiscountAmount = 10;
      }

      if (isGiftWrapped) {
        newSubtotal += quantity;
      }
    }

    const numPackages = Math.ceil(Object.values(newQuantities).reduce((acc, val) => acc + val, 0) / 10);
    const newShippingFee = numPackages * 5;
    const newGiftWrapFee = Object.values(newGiftWraps).reduce((acc, val) => acc + val, 0);
    const newTotal = newSubtotal - newDiscountAmount + newShippingFee + newGiftWrapFee;

    setSubtotal(newSubtotal);
    setDiscountName(newDiscountName);
    setDiscountAmount(newDiscountAmount);
    setShippingFee(newShippingFee);
    setGiftWrapFee(newGiftWrapFee);
    setTotal(newTotal);
  };

  return (
    <div>
      {products.map((product) => (
        <div key={product.name}>
                    <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
          <label>Quantity: </label>
          <input
            type="number"
            min="0"
            value={quantities[product.name] || ''}
            onChange={(e) => handleQuantityChange(product.name, parseInt(e.target.value))}
          />
          {quantities[product.name]===0?<>No Quantities Selected</>:
            <>
          <label>Gift Wrap: </label>
          <input
            type="checkbox"
            checked={giftWraps[product.name] || false}
            onChange={(e) => handleGiftWrapChange(product.name, e.target.checked)}
          />
          </>
          }
          <hr />
        </div>
      ))}
      <h3>Order Summary</h3>
      <p>Subtotal: ${subtotal}</p>
      {discountName && <p>Discount Applied: {discountName} (${discountAmount})</p>}
      <p>Shipping Fee: ${shippingFee}</p>
      <p>Gift Wrap Fee: ${giftWrapFee}</p>
      <h4>Total: ${total}</h4>
    </div>
  );
};

export default App;

