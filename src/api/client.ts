import axios, { AxiosRequestConfig } from 'axios';
import AuthService from '../services/auth/auth-service';
import { raiseError } from '../components/errorMessages/ErrorMessages';
import { router } from '../main';

//const SERVER_URL = 'http://localhost:44305/'

export default class Client {
    static _serverApiUrl: string = 'http://localhost:44305/'//`${SERVER_URL}`

    static async Get<T>(url: string, needAuthorize: boolean = true): Promise<T | Error> {
        var axiosRequestConfig: AxiosRequestConfig = {}
        if (needAuthorize) {
            var token = await this.GetToken();

            if (token instanceof Error)
                return token

            axiosRequestConfig = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        }

        return await axios.get<T>(`${this._serverApiUrl}${url}`, axiosRequestConfig)
            .then(response => response.data)
            .catch(error => this.HandleError(error));
    }

    static async Post<T>(url: string, data: any = {}, needAuthorize: boolean = true): Promise<T | Error> {
        var axiosRequestConfig: AxiosRequestConfig = {}
        if (needAuthorize) {
            var token = await this.GetToken();

            if (token instanceof Error)
                return token

            axiosRequestConfig = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        }

        return await axios.post<T>(`${this._serverApiUrl}${url}`, data, axiosRequestConfig)
            .then(response => response.data)
            .catch(error => this.HandleError(error));
    }

    static async GetToken(): Promise<string | Error> {
        var token = localStorage.getItem("token");
        var tokenExpiresDate = localStorage.getItem("tokenExpiresDate");

        if (token == null || tokenExpiresDate == null || Date.parse(tokenExpiresDate) < Date.now()) {
            var refreshToken = localStorage.getItem("refreshToken");
            var refreshTokenExpiresDate = localStorage.getItem("refreshTokenExpiresDate");

            let service = new AuthService();

            if (refreshToken == null || refreshTokenExpiresDate == null || Date.parse(refreshTokenExpiresDate) < Date.now()) {
                raiseError("Требуется авторизация")

                router.push(`/login?returnLink=${window.location.pathname}`)

                return new Error()
            }
            else {
                let refreshTokenResponse = await service.RefreshToken({ refreshTokenId: refreshToken! })

                if (refreshTokenResponse instanceof Error) {
                    raiseError("Требуется авторизация")

                    
                    router.push(`/login?returnLink=${window.location.pathname}`)

                    return new Error()
                }

                token = localStorage.getItem("token");
            }
        }

        return token!;
    }

    static async HandleError(error: any): Promise<Error> {
        if (error.response.status == 401) {
            raiseError("Требуется авторизация")

            router.push(`/login?returnLink=${window.location.pathname}`)

            return new Error(error);
        }
        else {
            raiseError(error.response.data)
        }

        return new Error(error);
    }
}