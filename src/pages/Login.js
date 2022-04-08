import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const user = await signIn(data.email, data.password);

    // const product = {
    //   name: 'X-Tudo',
    //   description: 'Pão, Hamburger, Ovo, Presunto, Queijo, Salada',
    //   price: 19.99,
    //   codigoRestaurante: 'mtL0p2GEjGYHcdqqS0YobObfhhy2'
    // }

    // const responseProduct = await firebaseInstance.addProduct(firebaseInstance.generateKey(), product)

    if (user.uid) {
      navigate("/admin/dashboard");
    }
  };

  return (
    <Container className="top-0">
      <CardForm>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>Seja Bem Vindo!</FormTitle>       

            <CustomInput
              {...register("email")}
              placeholder="Seu email"
            />
          <CustomInput
            {...register("password", { required: true })}
            type="password"
            placeholder="Senha"
          />
          {errors.exampleRequired && <span>This field is required</span>}

          <CustomButton type="submit" value="Entrar" />
        </form>
      </CardForm>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: #f2f2f2;
  margin-top: -21px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1rem;
`;

const CardForm = styled.div`
  width: 390px;
  height: 540px;

  border-radius: 10px;

  padding: 77px 55px 33px;

  background: #fff;
  display: flex;
  align-items: center;
  flex-direction: column;
  -webkit-box-shadow: 0px 0px 10px -2px rgba(0, 0, 0, 0.58);
  box-shadow: 0px 0px 10px -2px rgba(0, 0, 0, 0.58);
`;

const FormTitle = styled.span`
  display: block;
  font-size: 30px;
  color: #333;
  line-height: 1.2;
  text-align: center;
`;

const CustomInput = styled.input`
  width: 100%;
  height: 2rem;

  margin-top: 1rem;

  border: none;

  border-bottom: 2px solid #c3c3c3;
  border-radius: 0.25rem;
`;

const CustomButton = styled.input`
  width: 100%;
  padding: 0.25rem;
  margin-top: 1rem;

  border: 1px solid #c3c3c3;
  border-radius: 0.25rem;
  font-weight: bold;

  cursor: pointer;
`;
