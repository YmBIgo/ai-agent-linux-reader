import { Box, Button, CircularProgress, styled, TextareaAutosize } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";

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

const JsonResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [downloadUrl, setDownloadUrl] = useState<string>("");
    const [displayJsonResult, setDisplayJsonResult] = useState<string>("");
    async function searchLinuxJson(fullPath: string) {
        setIsLoading(true);
        try {
            const response = await fetch("https://linux-reader-getter-216690996383.asia-northeast1.run.app", {
                method: "POST",
                body: JSON.stringify({
                    fullPath
                })
            });
            const result = await response.json();
            setDownloadUrl(result.downloadUrl);
            if (!result.downloadUrl) return;
            setDisplayJsonResult(JSON.stringify(result.content));
        } catch(e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }
    const onClickBackToSearch = () => {
        navigate("/linux-reader/")
    }
    useEffect(() => {
        const fullPath = searchParams.get("fullPath");
        if (!fullPath) return;
        searchLinuxJson(fullPath);
    }, [searchParams]);
    return (
        <Box sx={{
            margin: "20px"
        }}>
            <h3>
                {searchParams.get("fullPath") || "入力されていません"}の結果
                {"　"}
                <Button onClick={onClickBackToSearch}>
                    検索画面に戻る
                </Button>
            </h3>
            { isLoading
            ?
            <CircularProgress/>
            :
            <Box sx={{
                display: "flex",
                displayFlow: "row",
                gap: "40px",
                justifyContent: "space-between"
            }}>
                <Box sx={{
                    flexBasis: "calc(40vw - 20px)"
                }}>
                    <p><a href={downloadUrl}>✅ JSONのダウンロードはこちらから</a></p>
                    <hr/>
                    <h4>ダウンロードした後の使い方</h4>
                    <ol>
                        <li>
                            JSONのLinuxのパスは、Linuxがルートパスの相対パスになっているので、これを全てご自身のフォルダ構成に合わせた絶対パスにします
                            <br/>
                            <small>例：「originalFilePath":"/linux/kernel/sched/core.c"」→「originalFilePath":"<strong><u>/path/to/your/directory</u></strong>/linux/kernel/sched/core.c"」</small>
                        </li>
                        <li><a target="_blank" href="https://marketplace.visualstudio.com/items?itemName=coffeecupjapan.linux-reader">Linux Reader</a>を、VSCodeで開きます</li>
                        <li>Linux Readerの初期画面で「検索履歴入力に移動する」を押し、1で修正したファイルのパスを入力し、タスクを開始します</li>
                        <li>これで途中結果から探索が可能になります</li>
                    </ol>
                </Box>
                <Box sx={{
                    flexBasis: "calc(60vw - 20px)"
                }}>
                    <p>JSONの内容</p>
                    <CustomTextarea
                        value={displayJsonResult}
                        contentEditable={false}
                        style={{
                            width: "calc(60vw - 40px)"
                        }}
                        minRows={15}
                    >
                    </CustomTextarea>
                </Box>
            </Box>
            }
        </Box>
    )
}

export default JsonResult;