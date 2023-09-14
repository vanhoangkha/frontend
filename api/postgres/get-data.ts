import NQLBackendClient from "@/lib/axios"
import { ResultData } from "@/types/api"
import { AxiosResponse } from "axios"

type Response = ResultData

const getData = async (query: string): Promise<Response> => {
    const { data } = await NQLBackendClient.post<any, AxiosResponse<Response, any>>("/postgres/execute",
        {
            query
        }
    )

    return data
}

export default getData