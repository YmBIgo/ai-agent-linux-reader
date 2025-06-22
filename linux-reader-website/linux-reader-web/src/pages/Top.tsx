import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router";
import { useState } from "react";

const Top = () => {
  const [query, setQuery] = useState("");

  const navigate = useNavigate();
  const onClickSearch = () => {
    if (!query) return;
    navigate(`/linux-reader/searchResult?search=${query}`);
  };
  const onClickGotoRegister = () => {
    navigate("/linux-reader/register");
  };

  return (
    <Box sx={{
        display: "flex",
        flexDirection: "row",
        gap: "2vw",
        height: "90vh"
    }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          flex: 1
        }}
      >
        <a href="https://marketplace.visualstudio.com/items?itemName=coffeecupjapan.linux-reader">
          <img src="https://vulnhuntr.s3.us-west-1.amazonaws.com/linux-reader-logo.png" width={100} height={100}/>
        </a>
        <h3>
          Linux-Reader Search{"　"}
          <Button onClick={onClickGotoRegister}>登録する</Button>
        </h3>
        <TextField
          sx={{
            width: "45vw",
            margin: "20px 1vw",
          }}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder="検索したいLinuxのワードを入力"
        />
        <Button onClick={onClickSearch} variant="contained" color="primary">
          検索する
        </Button>
      </Box>
      <Box sx={{
        flex: 0.7,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingLeft: "4vw",
        paddingRight: "3vw",
        borderLeft: "2px dashed black",
      }}>
          <h3 style={{margin: "5px 0"}}>使い方</h3>
          <ol>
            <li><a href="https://marketplace.visualstudio.com/items?itemName=coffeecupjapan.linux-reader" target="_blank">Linux Reader</a>をVSCodeにダウンロードする</li>
            <li>LinuxのコードベースをLinux Readerで探索し、その探索結果をJSONにして手元にダウンロードする（11のコマンド）</li>
            <li>（登録したい時）２で落としてきたJSONを、<Button onClick={onClickGotoRegister}>登録する</Button>ページから登録する</li>
            <li>（検索する時）右側の検索欄に検索したいキーワードを入力し、検索できます</li>
          </ol>
      </Box>
    </Box>
  );
};

export default Top;
