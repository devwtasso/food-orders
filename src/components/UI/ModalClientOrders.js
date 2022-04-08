import { useEffect, useState } from "react"

import { Modal } from "@mui/material";
import Box from "@mui/material/Box";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  justifyContent: "space-between",
};

export default function ModalOrders(props) {
  const [openModalClientOrders, setOpenModalClientOrders] = useState(props.open)

  useEffect(() => {
    console.log('entrei')
    if (props.onHideCard) {
      handleCloseModalClientOrders()

    }
  }, [props.onHideCard])

  const handleCloseModalClientOrders = () => setOpenModalClientOrders(false);

  return (
    <Modal
      open={openModalClientOrders}
      // onClose={handleCloseModalClientOrders}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} style={{ display: "flex", flexDirection: "column" }}>
        {props.children}
      </Box>
    </Modal>
  )
}
