import {
  Box,
  Button,
  Card,
  CardActions,
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

  useEffect(() => {
    setTransactionList(TRANSACTION_LIST);
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
    Investments: "investment-card",
    "Loan Payment": "expenditure-card",
  };

  return (
    <div className="transaction">
      <div className="transaction-card-list">
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
                  {t.accountNo.match(/.{1,4}/g).join(" - ")}
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
            type: "number",
            ...getPayloadDataHook("accountNo"),
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
              <MenuItem value={"Investments"}>Investments</MenuItem>
              <MenuItem value={"Loan Payment"}>Loan Payment</MenuItem>
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

          <div style={{ float: "right", paddingRight: '28px' }}>
            <Button variant={"contained"} color="primary">
              Edit
            </Button>
            <Button>Delete</Button>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default ManageTransaction;

const TRANSACTION_LIST = [
  {
    id: 1,
    accountNo: "1111111111111111",
    subtype: "1",
    type: "Earning",
    amount: "1",
    mode: "Cash",
    date: "2021-10-06",
  },
  {
    id: 2,
    accountNo: "123334456765432",
    subtype: "q",
    type: "Earning",
    amount: "1",
    mode: "Cash",
    date: "2021-10-06",
  },
  {
    id: 3,
    accountNo: "1234567654323",
    subtype: "w",
    type: "Expenditure",
    amount: "1",
    mode: "Card",
    date: "2021-10-06",
  },
  {
    id: 4,
    accountNo: "41234567643",
    subtype: "e",
    type: "Investments",
    amount: "1",
    mode: "Cheque",
    date: "2021-10-06",
  },
  {
    id: 5,
    accountNo: "123456754325",
    subtype: "r",
    type: "Loan Payment",
    amount: "1",
    mode: "Account",
    date: "2021-10-06",
  },
  {
    id: 6,
    accountNo: "612345765432",
    subtype: "t",
    type: "Expenditure",
    amount: "1",
    mode: "1",
    date: "2021-10-06",
  },
  {
    id: 7,
    accountNo: "71234564322",
    subtype: "y",
    type: "Earning",
    amount: "1",
    mode: "1",
    date: "2021-10-06",
  },
  {
    id: 8,
    accountNo: "81234565432",
    subtype: "u",
    type: "Earning",
    amount: "1",
    mode: "1",
    date: "2021-10-06",
  },
];
