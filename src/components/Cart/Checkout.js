import React, { useRef, useState } from "react";

const isEmpty = (value) => value.trim() === "";
const isFiveChars = (value) => value.length === 5;

const Checkout = (props) => {
  const [formInputsValidity, setFormInputsValidity] = useState({
    name: true,
    phone: true,
    street: true,
    number: true,
    district: true,
  });

  const nameInputRef = useRef();
  const streetInputRef = useRef();
  const numberInputRef = useRef();
  const districtInputRef = useRef();
  const phoneInputRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredPhone = phoneInputRef.current.value;
    const enteredStreet = streetInputRef.current.value;
    const enteredNumber = numberInputRef.current.value;
    const enteredDistrict = districtInputRef.current.value;

    const enteredNameIsValid = !isEmpty(enteredName);
    const enteredPhoneIsValid = !isEmpty(enteredPhone);
    const enteredStreetIsValid = !isEmpty(enteredStreet);
    const enteredNumberIsValid = isFiveChars(enteredNumber);
    const enteredDistrictIsValid = !isEmpty(enteredDistrict);

    setFormInputsValidity({
      name: enteredNameIsValid,
      phone: enteredPhoneIsValid,
      Street: enteredStreetIsValid,
      number: enteredNumberIsValid,
      district: enteredDistrictIsValid,
    });

    props.onSubmit({
      name: enteredName,
      phone: enteredPhone,
      street: enteredStreet,
      number: enteredNumber,
      district: enteredDistrict,
    });
  };
  return (
    <form className="my-4 mx-0 h-[19rem] overflow-auto" onSubmit={handleSubmit}>
      <div className="mb-2 flex justify-between" style={{ gap: '4px' }}>
        <div className="w-full">
          <label
            className={`font-bold mb-1 block ${
              formInputsValidity.name ? "" : "text-red-450"
            }`}
            htmlFor="name"
          >
            Seu nome
          </label>
          <input
            className={`font-inherit custom-border rounded w-full max-w-full ${
              formInputsValidity.name ? "" : "border-red-550 bg-red-75"
            }`}
            type="text"
            id="name"
            ref={nameInputRef}
          />
        </div>
        <div className="w-full">
          <label
            className="font-bold mb-1 block"
            htmlFor="phone"
          >
            Seu Telefone
          </label>
          <input
            className="font-inherit custom-border rounded w-full max-w-full"
            type="text"
            id="telefone"
            ref={phoneInputRef}
          />
        </div>
      </div>
      <div className="mb-2">
        <label
          className={`font-bold mb-1 block ${
            formInputsValidity.street ? "" : "text-red-450"
          }`}
          htmlFor="street"
        >
          Endereço
        </label>
        <input
          className={`font-inherit custom-border rounded w-full max-w-full ${
            formInputsValidity.street ? "" : "border-red-550 bg-red-75"
          }`}
          type="text"
          id="street"
          ref={streetInputRef}
        />
      </div>
      <div className="mb-2 flex justify-between"  style={{ gap: '4px' }}>
        <div className="w-10">
          <label
            className={`font-bold mb-1 block ${
              formInputsValidity.number ? "" : "text-red-450"
            }`}
            htmlFor="number"
          >
            Numero
          </label>
          <input
            className={`font-inherit custom-border rounded w-full max-w-full ${
              formInputsValidity.number ? "" : "border-red-550 bg-red-75"
            }`}
            type="number"
            id="number"
            ref={numberInputRef}
          />
        </div>
        <div className="w-full">
          <label className="font-bold mb-1 block" htmlFor="district">
            Bairro
          </label>
          <input
            className={`font-inherit custom-border rounded w-full max-w-full`}
            type="text"
            id="district"
            ref={districtInputRef}
          />
        </div>
      </div>
      <div className="mb-2"></div>
      <div className="flex justify-end gap-4">
        <button className="checkout-btn" type="button" onClick={props.onCancel}>
          Cancelar
        </button>
        <button className="checkout-btn bg-yellow-980 text-white border border-solid border-yellow-980 hover:bg-yellow-880 active:bg-yellow-880">
          Confirmar pedido
        </button>
      </div>
    </form>
  );
};

export default Checkout;
