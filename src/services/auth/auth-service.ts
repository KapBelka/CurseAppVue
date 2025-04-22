import Client from "../../api/client"
import AuthTokenDto from "./dtos/auth-token-dto";
import CurrentUserDto from "./dtos/current-user-dto";
import LoginDto from "./dtos/login-dto";
import RefreshTokenDto from "./dtos/refresh-token-dto";
import RegisterDto from "./dtos/register-dto";

export default class AuthService {
    public async GetCurrentUser(): Promise<CurrentUserDto | Error> {
        return await Client.Get("Users/get-current-user")
    }

    public async Register(dto: RegisterDto): Promise<void | Error> {
        var tokens = await Client.Post<AuthTokenDto | Error>("Users/register", dto, false)

        if (tokens instanceof Error)
            return tokens;

        this.SaveTokens(tokens)
    }

    public async Login(dto: LoginDto): Promise<void | Error> {
        var tokens = await Client.Post<AuthTokenDto | Error>("Users/login", dto, false)

        if (tokens instanceof Error)
            return tokens;

        this.SaveTokens(tokens)
    }

    public async RefreshToken(dto: RefreshTokenDto): Promise<void | Error> {
        var tokens = await Client.Post<AuthTokenDto | Error>("Users/refresh-token", dto, false)

        if (tokens instanceof Error)
            return tokens;

        this.SaveTokens(tokens)
    }

    private SaveTokens(tokens: AuthTokenDto) {
        localStorage.setItem("token", tokens.jwtToken);
        localStorage.setItem("tokenExpiresDate", tokens.jwtTokenExpiresDate.toString());
        localStorage.setItem("refreshToken", tokens.refreshToken);
        localStorage.setItem("refreshTokenExpiresDate", tokens.refreshTokenExpiresDate.toString());
    }
}