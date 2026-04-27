import { AccessTokenPayload } from "../utils/jwt";
import { ProjectMember } from "../models/ProjectMember";
import { OrgMember } from "../models/OrgMember";
import { Organization } from "../models/Organization";
import { Project } from "../models/Project";

declare global {
    namespace Express {
        interface Request {
            user?: AccessTokenPayload;
            orgMember?: OrgMember;
            projectMember?: ProjectMember;
            org?: Organization;
            project?: Project;
        }
    }
}
