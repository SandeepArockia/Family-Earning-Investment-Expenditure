import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  AiOutlineBank,
  BiRupee,
  BsCreditCardFill,
  FaFileSignature,
} from "react-icons/all";
import { TRANSACTION_LIST } from "./dbdata";
import { axios } from "axios";

const ManageTransaction = () => {
  const { id } = useParams();
  const history = useHistory();

  const [transactionList, setTransactionList] = useState([]);

  const [payload, setPayloadObject] = useState({});
  const setPayload = (key) => (val) =>
    setPayloadObject({ ...payload, [key]: val });
  const getPayload = (key) => payload[key];
  const getPayloadDataHook = (key) => ({
    value: getPayload(key) || "",
    onChange: (a) => {
      setPayload(key)(a.target.value);
    },
  });

  const getAllData = async () => axios.get("/transactions");

  const postData = async (data) => axios.post("/transaction", { data });

  const putData = async (id, data) => axios.put("/transaction/" + id, { data });

  const deleteData = async (id, data) =>
    axios.delete("/transaction/" + id, { data });

  useEffect(() => {
    getAllData().then((res) => {
      setTransactionList(res);
    });
  }, []);

  useEffect(() => {
    setPayloadObject(
      transactionList.find((t) => t.id?.toString() === id?.toString()) || {}
    );
    // eslint-disable-next-line
  }, [id]);

  const getTextField = (labelProps) => <TextField {...labelProps} />;

  const ModeIconMap = {
    Cash: <BiRupee />,
    Card: <BsCreditCardFill />,
    Cheque: <FaFileSignature />,
    Account: <AiOutlineBank />,
  };

  const TypeClass = {
    Earning: "earning-card",
    Expenditure: "expenditure-card",
    Investment: "investment-card",
    Loan: "expenditure-card",
  };

  return (
    <div className="transaction">
      <div className="transaction-card-list">
        <Card
          class={`transaction-card`}
          onClick={() => history.push("/transaction")}
        >
          <Button variant={"outlined"} fullWidth={true}>
            Add Transaction
          </Button>
        </Card>
        {transactionList.map((t) => {
          return (
            <Card
              class={`transaction-card ${TypeClass[t.type]}`}
              onClick={() => history.push("/transaction/" + t.id)}
            >
              <CardContent>
                <div style={{ display: "flex" }}>
                  <div style={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {t.type}
                    </Typography>
                  </div>
                  <div style={{ flexShrink: 1, paddingTop: "8px" }}>
                    {ModeIconMap[t.mode]}
                  </div>
                </div>

                <Typography gutterBottom variant="subtitle2" component="div">
                  {(t?.accountId + "XXXXXXXXXX")?.match(/.{1,4}/g)?.join(" - ")}
                  <Typography sx={{ fontSize: 14 }} gutterBottom>
                    ₹&nbsp;{t.amount}
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Box
        style={{ margin: "20px" }}
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "calc(50% - 30px)" },
          "& .MuiFormControl-root": { m: 1, width: "calc(50% - 30px)" },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          {getTextField({
            label: "Transaction ID",
            ...getPayloadDataHook("id"),
            value: id === undefined ? "" : id,
            disabled: id === undefined || id === null,
          })}
          {getTextField({
            label: "Account No.",
            ...getPayloadDataHook("accountId"),
          })}
          {getTextField({
            label: "Date",
            type: "date",
            defaultValue: new Date().toString(),
            InputLabelProps: { shrink: true },
            ...getPayloadDataHook("date"),
          })}
          <FormControl fullWidth>
            <InputLabel id="t">Transaction Type</InputLabel>
            <Select
              labelId="t"
              id="t"
              label="Transaction Type"
              {...getPayloadDataHook("type")}
            >
              <MenuItem value={"Earning"}>Earning</MenuItem>
              <MenuItem value={"Expenditure"}>Expenditure</MenuItem>
              <MenuItem value={"Investment"}>Investment</MenuItem>
              <MenuItem value={"Loan"}>Loan</MenuItem>
            </Select>
          </FormControl>
          {getTextField({ label: "Type", ...getPayloadDataHook("type") })}
          {getTextField({
            label: "SubType",
            ...getPayloadDataHook("subtype"),
          })}
          {getTextField({ label: "Amount", ...getPayloadDataHook("amount") })}
          <FormControl fullWidth>
            <InputLabel id="m">Mode of Payment</InputLabel>
            <Select
              labelId="m"
              id="m"
              label="Mode of Payment"
              {...getPayloadDataHook("mode")}
            >
              <MenuItem value={"Cash"}>Cash</MenuItem>
              <MenuItem value={"Card"}>Card</MenuItem>
              <MenuItem value={"Cheque"}>Cheque</MenuItem>
              <MenuItem value={"Account"}>Account</MenuItem>
            </Select>
          </FormControl>

          <div style={{ float: "right", paddingRight: "28px" }}>
            <Button
              variant={"contained"}
              color="primary"
              onClick={
                id === undefined
                  ? () => postData(payload)
                  : () => putData(id, payload)
              }
            >
              {id === undefined ? "Add" : "Edit"}
            </Button>
            <Button onClick={() => deleteData(id, payload)}>Delete</Button>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default ManageTransaction;
