/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import FormControl from "@mui/material/FormControl";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import styled from "styled-components";
import firebaseInstance from "../services/firebase";
import { Alert, AlertTitle, Button, Grid, IconButton, Stack } from "@mui/material";

import { styled as styledMUI } from "@mui/material/styles";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  justifyContent: "space-between",
};

const Input = styledMUI("input")({
  display: "none",
});

export default function Dashboard() {
  const navigate = useNavigate();

  const [usuarioID, setUsuarioID] = useState(undefined);
  const [openModalProduto, setOpenModalProduto] = useState(false);
  const [openModalEditarProduto, setOpenModalEditarProduto] = useState(false);
  const [openModalCategoria, setOpenModalCategoria] = useState(false);
  
  const [produto, setProduto] = useState({});
  const [categories, setCategories] = useState([]);
  const [produtosLista, setProdutosLista] = useState([]);
  const [image, setImage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [alertSucesso, setAlertSucesso] = useState(false)
  const [alertErro, setAlertErro] = useState(false)

  const handleOpenModalProduto = () => setOpenModalProduto(true);
  const handleCloseModalProduto = () => setOpenModalProduto(false);

  const handleOpenModalEditarProduto = () => setOpenModalEditarProduto(true);
  const handleCloseModalEditarProduto = () => setOpenModalEditarProduto(false);

  const handleOpenModalCategoria = () => setOpenModalCategoria(true);
  const handleCloseModalCategoria = () => setOpenModalCategoria(false);

  let tabelaTemp = [];

  useEffect(async () => {
    const id = localStorage.getItem("usuarioID");
    const token = localStorage.getItem("usuarioToken");

    setUsuarioID(id);

    if (!usuarioID && !token) {
      navigate("/login");
    }

    handleGetCategories(id)

    const listaProdutos = await handleGetProducts(id);

    setProdutosLista(listaProdutos);

    setProduto({
      id: "",
      name: "",
      price: 0,
      description: "",
      category: "",
      image: "",
      restaurantCode: process.env.REACT_APP_RESTAURANT_ID,
    });
  }, []);

  const handleGetCategories = async (codigoRestaurante) => {
    let temp = []
    const docs = await firebaseInstance.getCategories(codigoRestaurante);

    docs.forEach((snap) => {
      const data = snap.data();
      temp.push({ label: data.category, value: data.category, id: snap.id });
    });
    setCategories(temp)
  };

  const handleGetProducts = async (codigoRestaurante) => {
    const docs = await firebaseInstance.getProducts(codigoRestaurante);

    docs.forEach((snap) => {
      const data = snap.data();
      tabelaTemp.push({...data, id: snap.id});
    });

    setProdutosLista(tabelaTemp);
    return tabelaTemp;
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const key = firebaseInstance.generateKey();

      const urlImage = await firebaseInstance.storeImage(
        key,
        `/products/`,
        image
      );

      let produtoObj = produto;

      produtoObj = { ...produtoObj, image: urlImage }

      firebaseInstance.addProduct(key, produtoObj);

      handleGetProducts(localStorage.getItem("usuarioID"));

      setImage("")
      setIsLoading(false);
      setAlertSucesso(true);

    } catch (err) {
      setAlertErro(true);
      console.log(err);
    }
  };

  const handleSubmitEditProduct = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const key = firebaseInstance.generateKey();

      const urlImage = await firebaseInstance.storeImage(
        key,
        `/products/`,
        image
      );

      let produtoObj = produto;

      produtoObj = { ...produtoObj, image: urlImage }

      firebaseInstance.editProduct(produtoObj.id, produtoObj);

      setIsLoading(false);
      setAlertSucesso(true);
      setOpenModalEditarProduto(false);

      handleGetProducts(localStorage.getItem("usuarioID"))

    } catch (err) {
      setAlertErro(true);
      console.log(err);
    }  
  }


  const alertErroSalvar = (
    <Alert severity="error">
      <AlertTitle>Erro</AlertTitle>
      Ocorreu um erro ao tentar salvar o produto — <strong>Tente novamente!</strong>
    </Alert>
  )

  const alertSucessoSalvar = (
    <Alert severity="success">
      <AlertTitle>Sucesso</AlertTitle>
      Produto salvo com sucesso.
    </Alert>
  )

  useEffect(() => {
    setTimeout(() => {
      setAlertSucesso(false)
      setAlertErro(false)
    }, 4000)
  }, [alertSucesso, alertErro])

  const ModalProduto = (
    <Modal
      open={openModalProduto}
      onClose={handleCloseModalProduto}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} style={{ display: "flex", flexDirection: "column" }}>
        {isLoading ? (
          <CircularProgress />
        ) : (           
          <>
          {alertSucesso ? alertSucessoSalvar : ''}
          {alertErro ? alertErroSalvar : ''}
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Cadastrar Produto
            </Typography>
            <form>
              <Grid container spacing={1}>
                <Grid xs={12} sm={6} item>
                  <TextField
                    placeholder="Produto"
                    label="Nome Produto"
                    variant="outlined"
                    fullWidth
                    required
                    onChange={(e) =>
                      setProduto({ ...produto, name: e.target.value })
                    }
                  />
                </Grid>
                <Grid xs={12} sm={6} item>
                  <TextField
                    placeholder="R$ 9,99"
                    label="Valor"
                    variant="outlined"
                    fullWidth
                    type="number"
                    required
                    onChange={(e) =>
                      setProduto({ ...produto, price: e.target.value })
                    }
                  />
                </Grid>
                <Grid item lg={6} sm={12}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    
                    options={categories}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    style={{ minWidth: '100%' }} 
                    onChange={(event, newValue) => {
                      setProduto({ ...produto, category: newValue.value });
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Categoria" style={{ maxWidth: '100%' }} />
                    )}
                  />
                </Grid>
                <Grid item lg={6} style={{ marginTop: "10px" }}>
                  <Stack direction="row" alignItems="center" spacing={2} style={{ flexWrap: 'wrap' }}>
                    <label htmlFor="input-image-product">
                      <Input
                        accept="image/*"
                        id="input-image-product"
                        type="file"
                        onChange={(e) => {
                          setImage(e.target.files[0]);
                        }}
                      />
                      <Button size="small" variant="contained" component="span">
                        <PhotoCamera /> Imagem
                      </Button>
                    </label>
                    { 
                      image ? (
                        <span style={{ fontSize: '12px' }}>
                          {image.name}
                          <IconButton aria-label="delete" onClick={()=> setImage(null)}>
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      ) : <span style={{ fontSize: '12px' }}>Nenhuma imagem selecionada</span>
                    }                    
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Descrição"
                    multiline
                    rows={4}
                    placeholder="Breve descrição do produto"
                    variant="outlined"
                    fullWidth
                    required
                    onChange={(e) =>
                      setProduto({ ...produto, description: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmitProduct}
                  >
                    Salvar
                  </Button>
                </Grid>
              </Grid>
            </form>
          </>
        )}
      </Box>
    </Modal>
  );

  const ModalEditarProduto = (
    <Modal
      open={openModalEditarProduto}
      onClose={handleCloseModalEditarProduto}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} style={{ display: "flex", flexDirection: "column" }}>
        {isLoading ? (
          <CircularProgress />
        ) : (           
          <>
          {alertSucesso ? alertSucessoSalvar : ''}
          {alertErro ? alertErroSalvar : ''}
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Editar Produto
            </Typography>
            <form>
              <Grid container spacing={1}>
                <Grid xs={12} sm={6} item>
                  <TextField
                    placeholder="Produto"
                    label="Nome Produto"
                    variant="outlined"
                    fullWidth
                    required
                    value={produto.name}
                    onChange={(e) =>
                      setProduto({ ...produto, name: e.target.value })
                    }
                  />
                </Grid>
                <Grid xs={12} sm={6} item>
                  <TextField
                    placeholder="R$ 9,99"
                    label="Valor"
                    variant="outlined"
                    fullWidth
                    value={produto.price}
                    type="number"
                    required
                    onChange={(e) =>
                      setProduto({ ...produto, price: e.target.value })
                    }
                  />
                </Grid>
                <Grid item lg={6} sm={12}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    value={produto.category}
                    options={categories}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    style={{ minWidth: '100%' }} 
                    onChange={(event, newValue) => {
                      setProduto({ ...produto, category: newValue.value });
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Categoria" style={{ maxWidth: '100%' }} />
                    )}
                  />
                </Grid>
                <Grid item lg={6} style={{ marginTop: "10px" }}>
                  <Stack direction="row" alignItems="center" spacing={2} style={{ flexWrap: 'wrap' }}>
                    <label htmlFor="input-image-product">
                      <Input
                        accept="image/*"
                        id="input-image-product"
                        type="file"
                        onChange={(e) => {
                          setImage(e.target.files[0]);
                        }}
                      />
                      <Button size="small" variant="contained" component="span">
                        <PhotoCamera /> Imagem
                      </Button>
                    </label>
                    { 
                      image ? (
                        <span style={{ fontSize: '12px' }}>
                          {image.name}
                          <IconButton aria-label="delete" onClick={()=> setImage(null)}>
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      ) : <span style={{ fontSize: '12px' }}>Nenhuma imagem selecionada</span>
                    }                    
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Descrição"
                    multiline
                    value={produto.description}
                    rows={4}
                    placeholder="Breve descrição do produto"
                    variant="outlined"
                    fullWidth
                    required
                    onChange={(e) =>
                      setProduto({ ...produto, description: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmitEditProduct}
                  >
                    Salvar
                  </Button>
                </Grid>
              </Grid>
            </form>
          </>
        )}
      </Box>
    </Modal>
  );


  const [category, setCategory] = useState(categories[0]);
  const [categoryToDelete, setCategoryToDelete] = useState(categories[0]);
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = async (e) => {  
    e.preventDefault();

    const key = firebaseInstance.generateKey();    
    let inputCategoryObj = { category: newCategory, restaurantCode: localStorage.getItem("usuarioID")};

    firebaseInstance.addCategory(key, inputCategoryObj);

    handleGetCategories(localStorage.getItem("usuarioID"))
  }

  const handleDeleteCategory = async (e) => {
    e.preventDefault();
    firebaseInstance.removeCategory(categoryToDelete)
    
    handleGetCategories(localStorage.getItem("usuarioID"))
  }

  const ModalCategoria = (
    <Modal
      open={openModalCategoria}
      onClose={handleCloseModalCategoria}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <FormControl fullWidth>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={categories}
            onChange={(event, newValue) => {
              setCategoryToDelete(newValue.id);
            }}
            onInputChange={(e) => {
              setNewCategory(e.target.value);
            }}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Categorias" />
            )}
          />
        </FormControl>

        <Button variant="contained" onClick={handleAddCategory}>Adicionar</Button>
        {"   "}
        <Button variant="outlined" color="error" onClick={handleDeleteCategory}>
          Excluir
        </Button>
      </Box>
    </Modal>
  );

  const columns = [
    { field: "name", headerName: "Produto", minWidth: 150  },
    { field: "description", headerName: "Descrição", minWidth: 350 },
    { field: "price", headerName: "Valor" },
    { field: "category", headerName: "Categoria" },
    { field: "image", headerName: "Imagem URL" },
    { field: "id", headerName: "ID"},
    {
      field: 'action',
      headerName: 'Ações',
      sortable: false,
      renderCell: (params) => {
        const handleDelete = (e) => {
          e.stopPropagation(); // don't select this row after clicking
  
          const api = params.api;
          const thisRow = {};
  
          api
            .getAllColumns()
            .filter((c) => c.field !== '__check__' && !!c)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field)),
            );

          let confirmar = confirm("Deseja excluir o produto?");

          if (confirmar) {
            firebaseInstance.removeProduct(thisRow.id)

            handleGetProducts(localStorage.getItem("usuarioID"));
          }
        };

        const handleEdit = (e) => {
          e.stopPropagation(); // don't select this row after clicking
  
          const api = params.api;
          const thisRow = {};
  
          api
            .getAllColumns()
            .filter((c) => c.field !== '__check__' && !!c)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field)),
            );

          setProduto({
            name: thisRow.name,
            category: thisRow.category,
            description: thisRow.description,
            id: thisRow.id,
            price: thisRow.price,
          })

          setOpenModalEditarProduto(true);
        };
  
        return (
          <>
            <IconButton aria-label="delete" onClick={handleEdit}>
              <EditIcon />
            </IconButton>   

            <IconButton aria-label="delete" color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>                       
          </>
        );
      },
    },
  ];

  const tabelaDadosProdutos = (
    <div style={{ minHeight: '450px', width: "70%", background: "#fff" }}>
      <DataGrid
        rows={produtosLista}
        columns={columns}
        loading={produtosLista ? false : true}
        hideFooter
        hideFooterPagination
        hideFooterSelectedRowCount
        getRowId={(row) => Math.random()}
        checkboxSelection
      />
    </div>
  );

  return (
    <Container>
      <Header>
        <h1>Seja bem vindo!</h1>
      </Header>

      <ActionsCard>
        <ActionButton onClick={handleOpenModalProduto}>
          Novo Produto
        </ActionButton>

        <ActionButton onClick={handleOpenModalCategoria}>
          Nova Categoria
        </ActionButton>
        {ModalProduto}
        {ModalCategoria}
        {ModalEditarProduto}
      </ActionsCard>

      {tabelaDadosProdutos}
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;

  font-family: "Roboto", sans-serif;

  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: #383838;
`;

const Header = styled.header`
  width: 100%;
  text-align: center;

  background: #8a2b06;
  color: #fff;
`;

const ActionsCard = styled.div`
  width: 70%;
  height: 5rem;

  margin: 2rem auto;

  gap: 1rem;

  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  background: #fff;
`;

const ActionButton = styled.button`
  background: #a73e14;
  color: #fff;
  font-family: "Roboto";
  font-weight: 100;
  height: 2rem;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 0.5rem;
  border: 1px;

  cursor: pointer;

  &:hover {
    background: #8a2b06;
  }
`;
