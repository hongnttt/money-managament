const express = require("express");
const app = express();
const fs = require("fs");
const port = 3003;
const rawData = fs.readFileSync("./data/data.json");
const moment = require("moment");
const data = JSON.parse(rawData);

const formatString = (str) => {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  return str;
};

app.use(express.json());

app.get("/api/list", (req, res) => {
  const { keyword } = req.query;
  // const cloneData = JSON.parse(JSON.stringify(data));
  if (!keyword) {
    res.status(200).json({ message: "OK", data });
  } else {
    const filterData = data?.transactions?.filter((item) =>
      item?.category?.toLowerCase()?.includes(keyword?.toLowerCase())
    );

    if (filterData?.length) {
      const result = { ...data, transactions: filterData };
      res.status(200).json({ data: result });
    } else {
      res.status(404).json("Not found!");
    }
  }
});

app.get("/api/detail/:id", (req, res) => {
  const { id } = req.params;
  const filterData = data?.transactions?.find((x) => x?.id == id);
  if (filterData) {
    res.status(200).json(filterData);
  } else {
    res.status(404).json("Not found!");
  }
});

app.post("/api/add-item", (req, res) => {
  const { transactions_type, amount, note } = req.body;
  if (!transactions_type || !amount || amount < 0 || !note) {
    return res.status(404).json({ message: "Thông tin không hợp lệ, vui lòng kiểm tra lại!" });
  }

  const id = Math.random();
  data.transactions.unshift({
    id,
    transactions_type,
    amount,
    note,
    date: moment().format("YYYY-MM-DD"),
  });

  const total = parseInt(
    transactions_type === "income"
      ? parseInt(data.total_expenses || 0) + parseInt(amount || 0)
      : parseInt(data.total_expenses || 0) - parseInt(amount || 0)
  );
  data.total_expenses = total;

  res.status(200).json({ status: 200, message: "Successed", data });
});

app.put("/api/edit/:id", (req, res) => {
  const id = req.params.id;
  const { transactions_type, amount, note } = req.body;
  if (!transactions_type || !amount || !note) {
    return res.status(404).json({ message: "Thông tin không hợp lệ, vui lòng kiểm tra lại!" });
  }

  const findIndex = data?.transactions?.findIndex((x) => x?.id == id);
  if (findIndex == -1) {
    res.status(404).json({ message: "Không tìm thấy item" });
  } else {
    const total = parseInt(
      transactions_type === "income"
        ? parseInt(data.total_expenses || 0) + parseInt(amount || 0)
        : parseInt(data.total_expenses || 0) - parseInt(amount || 0) - parseInt(data.transactions[findIndex]?.amount || 0)
    );

    data.transactions[findIndex] = {
      ...data.transactions[findIndex],
      id: data.transactions[findIndex].id,
      transactions_type,
      amount,
      note,
      category: data.transactions[findIndex]?.category,
    };
    data.total_expenses = total;

    res.status(200).json({ message: "Cập nhật thành công.", data });
  }
});

app.delete("/api/delete/:id", (req, res) => {
  const id = req.params.id;

  const findIndex = data?.transactions?.findIndex((x) => x?.id == id);
  if (findIndex == -1) {
    res.status(404).json({ message: "Không tìm thấy item" });
  } else {
    const total = parseInt(
      data?.transactions[findIndex]?.transactions_type === "income"
        ? parseInt(data?.total_expenses || 0) - parseInt(data?.transactions[findIndex]?.amount || 0)
        : parseInt(data?.total_expenses || 0) + parseInt(data?.transactions[findIndex]?.amount || 0)
    );

    data?.transactions?.splice(findIndex, 1);
    data.total_expenses = total;
    res.status(200).json({ message: "Cập nhật thành công.", data });
  }
});

app.listen(port, () => {
  console.log("🚀 Server listenning port:", port);
});
