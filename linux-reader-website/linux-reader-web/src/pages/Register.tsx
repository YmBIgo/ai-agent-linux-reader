import { Button, styled, TextareaAutosize, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useNavigate } from "react-router";
import { convertToChoiceTree } from "../types/Choice";

const CustomTextarea = styled(TextareaAutosize)(
  () => ({
    width: '100%',
    fontSize: '16px',
    fontFamily: 'inherit',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    resize: 'vertical',
    '&:focus': {
      outline: 'none',
      borderColor: '#1976d2',
      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.2)',
    },
    '&::placeholder': {
      color: '#aaa',
    },
  })
);

const Register = () => {
    const [json, setJson] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [rootPath, setRootPath] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onChangeJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || !files.length) return;
        const file = files[0];
        if (!file.name.endsWith(".json")) return;
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            if (typeof fileReader.result !== "string") return;
            setJson(fileReader.result)
        })
        fileReader.readAsText(file);
    }

    const checkJson = (json: string, rootPath: string) => {
        let fixedRootPath = rootPath;
        if (rootPath.endsWith("/")) {
            fixedRootPath = rootPath.slice(0, -1);
        }
        // 万が一フロントで置換していない場合のために加える
        const rootPathReplaceRegex = new RegExp(`"${fixedRootPath}/linux`, "g");
        if (!rootPathReplaceRegex.test(json)) {
            return false;
        }
        return true;
    }

    const onSubmit = async () => {
        if (!json || !rootPath) {
            setError("必須項目を入力してください");
            return;
        }
        if (!checkJson(json, rootPath)) {
            setError("「Linux」フォルダまでのパスがjsonに含まれていません");
            return;
        }
        try {
            setIsLoading(true);
            const j = JSON.parse(json);
            const data = convertToChoiceTree(j);
            console.log(data);
            if (!data.content.functionName || !data.content.functionCodeLine || !data.content.id || !data.content.originalFilePath) {
                setError("登録するJSONの型が間違っています");
                return;
            }
            await fetch("https://linux-reader-indexer-216690996383.asia-northeast1.run.app", {
                method: "POST",
                body: JSON.stringify({
                    json,
                    rootPath,
                    description
                })
            });
            navigate("/linux-reader/")
        } catch(e) {
            console.error(e);
            setError("登録中にエラーが発生しました");
        } finally {
            setIsLoading(false);
        }
    }

    const navigate = useNavigate();
    const onClickGotoTop = () => {
        navigate("/linux-reader/")
    }
    return (
        <Box sx={{
            margin: "20px",
            display: "flex",
            flexFlow: "row",
            gap: "30px",
        }}>
            <Box sx={{
                borderRight: "1px dashed black",
                paddingRight: "30px",
                height: "calc(100vh - 40px)",
                display: "flex",
                alignItems: "center"
            }}>
                <h3>
                    JSONを登録する
                    <br/>
                    <Button onClick={onClickGotoTop} sx={{marginTop: "15px"}}>検索入力に戻る</Button>
                </h3>
            </Box>
            <Box>
                { error && <p style={{color: "red"}}>{error}</p> }
                { isLoading && <p style={{color: "green"}}>送信中...</p> }
                <p>JSONファイル{"　"}<span style={{color: "red"}}><strong>※ 必須</strong></span></p>
                <TextField
                    type="file"
                    onChange={onChangeJsonFile}
                    disabled={isLoading}
                ></TextField>
                <p>「Linux」フォルダまでのパス{"　"}<span style={{color: "red"}}><strong>※ 必須</strong></span></p>
                <TextField
                    sx={{width: "calc(100vw - 350px)"}}
                    placeholder="/path/to/your/linux/folder　linuxは含まない"
                    onChange={(e) => {
                        setRootPath(e.target.value);
                    }}
                    value={rootPath}
                    disabled={isLoading}
                >
                </TextField>
                <p>説明</p>
                <CustomTextarea
                    minRows={3}
                    onChange={(e) => {
                        setDescription(e.target.value);
                    }}
                    value={description}
                    disabled={isLoading}
                >
                </CustomTextarea>
                <br/>
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    color="primary"
                    sx={{marginTop: "20px"}}
                    disabled={isLoading}
                >
                    登録する
                </Button>
            </Box>
        </Box>
    )
}

export default Register;