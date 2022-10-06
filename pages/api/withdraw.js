import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB } from "../../backendLibs/dbLib";
import { writeUsersDB } from "../../backendLibs/dbLib";

export default function withdrawRoute(req, res) {
  if (req.method === "PUT") {
    //check authentication
    const user = checkToken(req);

    if (user.isAdmin) {
      return res.status(403).json({
        ok: false,
        message: "You do not have permission to withdraw",
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

    //find and update money in DB (if user has enough money)
    const users = readUsersDB();
    const foundUser = users.findIndex((x) => x.username === user.username);
    const newBalance = users[foundUser].money - amount;

    if (newBalance < 0)
      return res
        .status(400)
        .json({ ok: false, message: "You do not has enough money" });

    users[foundUser].money = newBalance;
    writeUsersDB(users);

    //return response
    return res.json({ ok: true, money: users[foundUser].money });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
