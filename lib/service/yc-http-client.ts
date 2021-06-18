import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export class YcHttpClient {
    readonly baseUrl = 'https://news.ycombinator.com/';
    readonly axiosConfig: AxiosRequestConfig = { timeout: 3000 }

    public getNewsPage(pageNumber: number): Promise<AxiosResponse> {
        const urlToFetch = this.baseUrl + 'news?p=' + pageNumber;
        return axios.get(urlToFetch, this.axiosConfig);
    }
}