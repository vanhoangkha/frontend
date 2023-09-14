"use client"

import { Clipboard } from "lucide-react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { format } from "sql-formatter"
import { cb } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useEffect, useState } from "react";
import PromptSearch from "@/components/prompt-search";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { SQLInference, ResultData } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';
import { getSQL, getData } from '@/api/postgres';
import { useSetting } from "@/stores";
import { useToast } from "@/components/ui/use-toast";


export default function Page() {
  const { toast, dismiss } = useToast()

  const [search, setSearch] = useState<string>('')
  const [copy, setCopy] = useState<boolean>(false)
  const [loading, setLoading] = useState<"query" | "execute" | null>(null)
  const [SQLInference, setSQLInference] = useState<SQLInference>()
  const [resultData, setResultData] = useState<ResultData>()

  const { catalog, database } = useSetting()

  const sqlText = SQLInference ? format(SQLInference.query, {
    language: "postgresql"
  }) : ""

  const disableButton = search.length === 0

  const onClick = async () => {
    if (search.length === 0)
      return
    setSQLInference(undefined)
    setResultData(undefined)
    try {
      const { id: sqlQueryToastId } = toast({
        title: "Generating SQL Query...",

      })
      setLoading("query")
      const sqlInferenceData = await getSQL(search)
      setSQLInference(sqlInferenceData)


      dismiss(sqlQueryToastId)

      const { id: athenaToastId } = toast({
        title: "Querying Data from RDS..."
      })
      setLoading("execute")
      const ResultData = await getData(sqlInferenceData.query)
      setResultData(ResultData)
      dismiss(athenaToastId)
    }
    catch (e: any) {
      toast({
        variant: "destructive",
        title: "Error occured!",
        description: e.toString()
      })
    }
    setLoading(null)
  }

  const onCopy = () => {
    setCopy(true)
    navigator.clipboard.writeText(sqlText)
  }

  useEffect(() => {
    if (copy) {
      const copyTimeout = setTimeout(() => {
        setCopy(false)
      }, 750)

      return () => clearTimeout(copyTimeout)
    }
  }, [copy])

  return (
    <section className="flex flex-col w-full items-center space-y-10 mt-8">
      <div className="w-[600px] space-y-4">
        <PromptSearch search={search} setSearch={setSearch} onClick={onClick} SQLInference={SQLInference} disabled={disableButton} />
        {loading === "query" && <div>
          <p className="relative z-10 text-gray-400 font-semibold text-center top-10">SQL Query</p>
          <Skeleton className="relative z-0 h-96" />
        </div>}
        {SQLInference && <div className="w-full space-y-4">
          {resultData?.data && <div className="p-2 border-gray-200 rounded-lg border-[1px] shadow-sm w-full"><Table title="Query Execution">
            <TableHeader>
              <TableRow>
                {resultData.data[0].map((data) =>
                  <TableHead>{data}</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* <TableBody className="flex flex-col max-h-96 overflow-y-scroll w-full"> */}
              {resultData.data.slice(1).map((row) =>
                <TableRow>
                  {row.map(c => <TableCell>{c}</TableCell>)}
                </TableRow>

              )}
            </TableBody>
          </Table></div>}
          {loading === "execute" && <div className='space-y-2'>
            <Skeleton className="h-6" />
            <Skeleton className="h-6" />
            <Skeleton className="h-6" />
            <Skeleton className="h-6 w-1/3" />
          </div>}
          <div className="w-full space-y-2 px-8 pt-4 pb-5 rounded-lg border-[#9F9F9F] border-[1px] shadow-md bg-[#222]">

            <div className='flex w-full justify-between items-center'>
              {/* Hidden div to align title in center and icon on the right. Can't be bothered to write actual CSS for it */}
              <div className="w-9 h-9" />
              <p className="font-semibold text-white">SQL Query</p>
              <TooltipProvider>
                <Tooltip open={copy}>
                  <TooltipTrigger asChild>
                    <div onClick={onCopy}>
                      <Clipboard className="text-white w-9 h-9 cursor-pointer p-2 rounded-sm hover:bg-gray-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copied!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <SyntaxHighlighter language='sql' wrapLines wrapLongLines style={
              cb
            }>
              {sqlText}
            </SyntaxHighlighter>
          </div>
        </div>}
      </div>

    </section >
  )
}
