import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB } from "../../backendLibs/dbLib";
import { writeUsersDB } from "../../backendLibs/dbLib";

export default function depositRoute(req, res) {
  if (req.method === "PUT") {
    //check authentication
    const { username, password, isAdmin } = req.body;
    const user = checkToken(req);

    if (!isAdmin) {
      if (!user || user.isAdmin)
        return res.status(403).json({
          ok: false,
          message: "You do not have permission to deposit",
        });
    }

    const amount = req.body.amount;
    //validate body
    if (typeof amount !== "number")
      return res.status(400).json({ ok: false, message: "Invalid amount" });

    if (amount < 1) {
      return res
        .status(400)
        .json({ ok: false, message: "Amount must be greater than 0" });
    }

    //find and update money in DB
    const users = readUsersDB();
    const foundUser = users.findIndex((x) => x.username === user.username);
    const newBalance = users[foundUser].money + amount;
    users[foundUser].money = newBalance;

    writeUsersDB(users);

    return res.json({ ok: true, money: users[foundUser].money });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
