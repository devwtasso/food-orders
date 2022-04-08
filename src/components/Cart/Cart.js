import React, { useContext, useEffect, useState } from 'react';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import CartContext from '../../store/cart-context';
import Checkout from './Checkout';
import ModalOrders from '../UI/ModalClientOrders';

const Cart = props => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const cartContext = useContext(CartContext);

  const [isOpen, setIsOpen] = useState(true)

  const totalAmount = `R$${cartContext.totalAmount.toFixed(2)}`;
  const hasItems = cartContext.items.length > 0;

  const handleCartItemAdd = item => {
    cartContext.addItem(item);
  };
  const handleCartItemRemove = id => {
    cartContext.removeItem(id);
  };

  const handleOrder = () => {
    setIsCheckout(true);
  };

  const handleSubmitOrder = async userData => {
    setIsSubmitting(true);
    const phone = '5516997238050'
    
    const pedidosHeaderString = 
    ` *NOVO PEDIDO* \n\n*NOME*: ${userData.name} \n*TELEFONE*: ${userData.phone} \n*RUA*: ${userData.street} \n*NUMERO*: ${userData.number} \n*BAIRRO*: ${userData.district} \n`;

    let pedidosItemsString = '';

    cartContext.items.map(item => {
      return pedidosItemsString = pedidosItemsString + ('\n *' + item.amount + '* - ' + item.name  + ' - ' + item.price);
    })

    const totalString = `*Total*: ${cartContext.totalAmount.toFixed(2)}`;

    const pedidoString = pedidosHeaderString + '\n *ITENS:* \n' + pedidosItemsString + '\n\n' + totalString;
    
    const encodedString = encodeURIComponent(pedidoString);
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedString}`

    window.open(url, '_blank');
    setIsSubmitting(false);
    setDidSubmit(true);
    cartContext.clearCart();
  };

  const cartItems = cartContext.items.map(cartItem => (
    <ul className="list-none m-0 p-0 max-h-80 overflow-auto" key={cartItem.id}>
      <CartItem
        key={cartItem.id}
        id={cartItem.id}
        name={cartItem.name}
        amount={cartItem.amount}
        price={cartItem.price}
        onAdd={handleCartItemAdd.bind(null, cartItem)}
        onRemove={handleCartItemRemove.bind(null, cartItem.id)}
      />
    </ul>
  ));

  const modalActions = (
    <div className="text-right">
      <button
        className="cart-btn text-yellow-750 border-yellow-750"
        onClick={props.onHideCart}
      >
        Fechar
      </button>
      {hasItems && (
        <button
          className="cart-btn bg-yellow-750 text-white"
          onClick={handleOrder}
        >
          Pedido
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <>
      {cartItems}
      <div className="flex items-center justify-between font-bold text-2xl my-4 mx-0">
        <span>Valor do pedido</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && (
        <Checkout onCancel={props.onHideCart} onSubmit={handleSubmitOrder} items={cartContext.items} />
      )}
      {!isCheckout && modalActions}
    </>
  );

  const isSubmittingModalContent = (
    <p className="text-2xl">Enviando pedido...</p>
  );

  const didSubmitModalContent = (
    <>
      <p className="text-2xl">Pedido realizado com sucesso!</p>
      <div className="text-right">
        <button
          className="cart-btn text-yellow-750 border-yellow-750"
          onClick={() => setIsOpen(false)}
        >
          Fechar
        </button>
      </div>
    </>
  );

  return (
    <ModalOrders open={isOpen} onHideCart={props.onHideCart}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {didSubmit && didSubmitModalContent}
    </ModalOrders>
  );
};

export default Cart;
