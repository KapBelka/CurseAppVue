export default interface AuthTokenDto {
    jwtToken: string
    jwtTokenExpiresDate: Date
    refreshToken: string
    refreshTokenExpiresDate: Date
}