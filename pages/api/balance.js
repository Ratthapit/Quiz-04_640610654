import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB } from "../../backendLibs/dbLib";

export default function balanceRoute(req, res) {
  if (req.method === "GET") {
    //check authentication

    const user = checkToken(req);

    if (user.isAdmin) {
      if (!user || user.isAdmin)
        return res.status(403).json({
          ok: false,
          message: "You do not have permission to check balance",
        });
    }

    const users = readUsersDB();
    const foundUser = users.findIndex((x) => x.username === user.username);

    return res.json({ ok: true, money: users[foundUser].money });

    ///return response
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
