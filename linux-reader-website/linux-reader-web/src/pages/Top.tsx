import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router";
import { useState } from "react";

const Top = () => {
    const [query, setQuery] = useState("")

    const navigate = useNavigate();
    const onClickSearch = () => {
        if (!query) return;
        navigate(`/linux-reader/searchResult?search=${query}`);
    }
    const onClickGotoRegister = () => {
        navigate("/linux-reader/register");
    }

    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
        }}>
            <h3>Linux-Reader Search{"　"}<Button onClick={onClickGotoRegister}>登録する</Button></h3>
            <TextField
                sx={{
                    width: "80vw",
                    margin: "20px 10vw"
                }}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                }}
                placeholder="検索したいLinuxのワードを入力"
            />
            <Button
                onClick={onClickSearch}
                variant="contained"
                color="primary"
            >
                検索する
            </Button>
        </Box>
    )
}

export default Top;