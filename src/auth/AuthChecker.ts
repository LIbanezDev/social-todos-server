import {AuthChecker} from "type-graphql";
import {Context} from "../types/graphql";


export const authChecker: AuthChecker<Context> =
    ({context: {req, user}}, roles) => {
        if (!user) {
            return false
        }

        if (roles.length === 0) { // if `@Authorized()`, check only is user exist
            return true;
        }

        if (user.roles.some(role => roles.includes(role))) {
            return true
        }
        // here we can read the user from context
        // and check his permission in the db against the `roles` argument
        // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
        return false; // or false if access is denied
    };
