import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { convertToSearchResult, type SearchResultType } from "../types/SearchResult";

const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [search, setSearch] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [displaySearchResult, setDisplaySearchResult] = useState<SearchResultType[]>([])

    const searchLinuxReader = async (search: string) => {
        setIsLoading(true);
        try {
            const response = await fetch("https://linux-reader-searcher-216690996383.asia-northeast1.run.app", {
                method: "POST",
                body: JSON.stringify({
                    search
                })
            });
            const result = await response.json();
            const typedResult = convertToSearchResult(result.result);
            setDisplaySearchResult(typedResult);
        } catch(e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    const onClickSearchAgain = () => {
        if (!search) return;
        navigate(`/linux-reader/searchResult?search=${search}`)
    }

    const onClickGotoTop = () => {
        navigate("/linux-reader/");
    }

    useEffect(() => {
        const search = searchParams.get("search");
        if (!search) return;
        searchLinuxReader(search);
    }, [searchParams])
    return (
        <Box sx={{
            margin: "20px"
        }}>
            <Box sx={{
                display: "flex",
                displayFlow: "row",
                gap: "30px"
            }}>
                <TextField
                    sx={{
                        width: "60vw"
                    }}
                    placeholder="検索したい内容を入力"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                ></TextField>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={onClickSearchAgain}
                >検索</Button>
                <Button
                    onClick={onClickGotoTop}
                >
                    トップ画面に戻る
                </Button>
            </Box>
            <br/>
            <hr/>
            <br/>
            { isLoading
            ?
            <CircularProgress/>
            :
            <>
                {displaySearchResult.length
                ? displaySearchResult.map((dsr, index) => {
                    return (
                        <Box
                            sx={{
                                display: "flex",
                                displayFlow: "row",
                                gap: "10px",
                                marginBottom: "20px"
                            }}
                            key={`${dsr.objectID}_${index}`}
                        >
                            <Box
                                sx={{
                                    flexBasis: "60vw"
                                }}
                            >
                                <Link to={`/linux-reader/jsonResult?fullPath=${dsr.fullPath}`}>{dsr.fullPath}</Link>
                                <p>
                                    {dsr.description || "説明はありません"}
                                    <br/>
                                    {dsr.hightlights || "ハイライトはありません"}
                                </p>
                            </Box>
                        </Box>
                    )
                })
                : <p>結果はありませんでした...</p>
                }
            </>
            }
        </Box>
    )
}

export default SearchResult;