import React, { useEffect, useState } from 'react';
import firebaseInstance from './../services/firebase';

import { Button } from "@mui/material";

import GoogleIcon from '@mui/icons-material/Google';
import LogoutIcon from '@mui/icons-material/Logout';

import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function ClientOrders(){
  const navigate = useNavigate()
  const [clientID, setClientID] = useState("");
  const [client, setClient] = useState(null);
  const [clientOrders, setClientOrders] = useState([]);

  useEffect(() => {
    getClientOrders()
  }, [])

  const getClientOrders = async () => {
    const clientID = localStorage.getItem("Client:ID")

    const docs = await firebaseInstance.getClientOrders(clientID)

    let tabelaTemp = [];

    docs.forEach((snap) => {
      const data = snap.data();
      tabelaTemp.push({...data, id: snap.id});
    });

    setClientOrders(tabelaTemp);
  }

  const existsUser = (id) => {
    firebaseInstance.getUser(id).then(response => {
      return response.exists
    })
  }
  
  const handleLoginWithGoogle = () => {
    firebaseInstance.signInWithGoogle().then(response => {
      localStorage.setItem("Client:TOKEN", response.user._delegate.accessToken);
      localStorage.setItem("Client:ID", response.user.uid);

      existsUser(response.user.uid)

      setClient(response.user)
      setClientID(response.user.uid)

      getClientOrders()
    })
  }

  const handleLogoutClient = () => {
    localStorage.removeItem("Client:TOKEN");
    localStorage.removeItem("Client:ID");

    setClient("")
    setClientID("")  

    navigate('/')
  }

  return (
    <Container>
      {
        !clientID ? (
          <Button 
            variant="contained" 
            startIcon={<GoogleIcon />}
            onClick={handleLoginWithGoogle}
          >
            Fazer login com Google
          </Button>
        ) : (
          <OrdersCard>
            <h1>Olá, {client.displayName}</h1>
            
            {
              clientOrders?.length > 0 ? (
                clientOrders.map(order => (
                  <OrderCard>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                      <span><strong>{order.restaurantName}</strong></span>
                      <span><strong>Data:</strong> {order.data}</span>
                    </div>
                    <hr />
                    {order.itens.map(item => (
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                          <span style={{ width: '80%' }}>{`${item.quantidade} - ${item.nome}`}</span>
                          <span style={{ textAlign: 'right'}}>{`Valor (un): R$ ${item.preco}`}</span>                        
                        </div>                        
                      </div>
                    ))}
                    <br />
                  </OrderCard>  
                ))
              ) : (
                <span>Você ainda não tem pedidos registrados</span>
              )
            }

            <br />

            <Button 
              variant="contained" 
              startIcon={<LogoutIcon />}
              onClick={handleLogoutClient}
            >
              Sair
            </Button>
          </OrdersCard>
        )
      }
    </Container>
  )
}

export default ClientOrders;

const Container = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  background: #fff;
`

const OrdersCard = styled.div`
  display: flex;

  flex-direction: column;
  justify-content: center;
  align-items: center;  
  min-width: 60%;
`

const OrderCard = styled.div`
  border: 1px solid #c3c3c3;
  padding: 2rem;

  border-radius: 10px;
  width: 80%;
`