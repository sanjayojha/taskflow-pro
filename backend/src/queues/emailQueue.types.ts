export type EmailJobData =
    | {
          type: "VERIFY_EMAIL";
          to: string;
          name: string;
          token: string;
      }
    | {
          type: "RESET_PASSWORD";
          to: string;
          name: string;
          token: string;
      }
    | {
          type: "ORG_INVITE";
          to: string;
          inviterName: string;
          orgName: string;
          token: string;
      };
