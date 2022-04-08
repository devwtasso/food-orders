import { BsFacebook,  BsWhatsapp } from 'react-icons/bs'
import { FaMapMarkerAlt } from 'react-icons/fa'
import React from 'react';

import styled from 'styled-components';

const MealsSummary = () => {
  return (
    <section className="text-center max-w-[45rem] w-[90%] m-auto mt-[-10rem] relative bg-gray-650 text-white rounded-2xl p-4 shadow-0.5xl">
      <h2 className="mt-0 font-bold text-3xl md:text-[2rem]">
        Faça seu pedido com facilidade
      </h2>
      <ContatoCard>
        <ContatoItem>
          <BsFacebook style={{ color: '#3b5998' }} />
          <span>Clique para acessar</span>
        </ContatoItem>
        <ContatoItem>
          <BsWhatsapp style={{ color: '#128C7E' }} />
          <span>Clique para acessar</span>
        </ContatoItem>
        <ContatoItem>
          <FaMapMarkerAlt />
          <span>Clique para acessar</span>
        </ContatoItem>
      </ContatoCard>
    </section>
  );
};

export default MealsSummary;

const ContatoCard = styled.div `
  width: 100%;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
`

const ContatoItem = styled.div `
  cursor: pointer;
  width: 120px;
  height: 120px;
  background-color: #fff;
  color: #000;

  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 4px;

  > :first-child {
    font-size: 3rem;
  }

  
`
