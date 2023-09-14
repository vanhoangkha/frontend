import NQLBackendClient from "@/lib/axios"
import { AxiosResponse } from "axios"

type Response = {
    query: string
}

const getSQL = async (prompt: string): Promise<Response> => {
    const { data } = await NQLBackendClient.post<any, AxiosResponse<Response, any>>("/postgres/inference",
        {
            prompt
        }
    )

    return data
}

export default getSQL