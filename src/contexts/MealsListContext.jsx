import { createContext, useState, useCallback } from "react";
import firebaseInstance from "../services/firebase";

export const MealsListContext = createContext();

export function MealsListProvider({ children }) {
  const [listaProdutos, setListaProdutos] = useState([]);

  const getProducts = async (codigoRestaurante) => {
    const docs = await firebaseInstance.getProducts(codigoRestaurante);
    const tabelaTemp = [];
    docs.forEach((snap) => {
      const data = snap.data();
      tabelaTemp.push([{ data }]);
    });

    setListaProdutos(tabelaTemp)
    return tabelaTemp;
  }

  return (
    <MealsListContext.Provider
      value={{ listaProdutos, getProducts }}
    >
      {children}
    </MealsListContext.Provider>
  );
}
