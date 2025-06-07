import AuthService from "../../../services/auth/auth-service";
import ProjectService from "../../../services/projects/project-service";

export abstract class ProjectPageServices {
    private static _projectService: ProjectService | null = null
    private static _authService: AuthService | null = null

    public static get ProjectService() {
        if (this._projectService == null)
            this._projectService = new ProjectService()
        return this._projectService
    }

    public static get AuthService() {
        if (this._authService == null)
            this._authService = new AuthService()
        return this._authService
    }
}