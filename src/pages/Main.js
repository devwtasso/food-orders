import { useState } from 'react';

import Cart from '../components/Cart/Cart';
import Header from '../components/Layout/Header';
import Meals from '../components/Meals/Meals';
import CartProvider from '../store/CartProvider';
import Footer from './../components/Layout/Footer';

function Main() {
  const [cartIsShown, setCartIsShown] = useState(false);

  const handleShowCart = () => {
    setCartIsShown(true);
  };

  const handleHideCart = () => {
    setCartIsShown(false);
  };

  return (
    <CartProvider>
      {cartIsShown && <Cart onHideCart={handleHideCart} />}
      <Header onShowCart={handleShowCart} />      
      <main>
        <Meals />
      </main>
      <Footer />
    </CartProvider>
  );
}

export default Main;
