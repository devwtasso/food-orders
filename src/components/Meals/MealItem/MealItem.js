import React, { useContext } from "react";

import MealItemForm from "./MealItemForm";
import CartContext from "../../../store/cart-context";

const MealItem = (props) => {
  const cartContext = useContext(CartContext);
  const price = `R$${props.price}`;

  const handleAddToCart = (amount) => {
    cartContext.addItem({
      id: props.id,
      name: props.name,
      amount: amount,
      price: props.price,
    });
  };

  return (
    <li className="flex justify-between m-4 pb-4 border-bottom">
      <div className="flex justify-between flex-wrap">
        <img
          src={props.image}
          alt={props.name}
          width="136px"
          height="136px"
          className="mr-4"
          style={{ borderRadius: "16px" }}
        />
        <div>
          <h3 className="mt-0 mx-0 mb-1">{props.name}</h3>
          <div className="">{props.category}</div>
          <br />
          <div className="italic">{props.description}</div>
          <div className="mt-1 font-bold text-xl text-yellow-550">{price}</div>
        </div>
      </div>
      <div>
        <MealItemForm id={props.id} onAddToCart={handleAddToCart} />
      </div>
    </li>
  );
};

export default MealItem;
