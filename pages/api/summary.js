import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB } from "../../backendLibs/dbLib";
import { writeUsersDB } from "../../backendLibs/dbLib";

export default function summaryRoute(req, res) {
  if (req.method === "GET") {
    const user = checkToken(req);

    if (!user.isAdmin) {
      return res.status(403).json({ ok: false, message: "Permission denied" });
    }

    const data = readUsersDB();

    let userCount = 0;
    let adminCount = 0;

    for (let i of data) {
      if (i.isAdmin) adminCount++;
      else userCount++;
    }

    let totalMoney = data
      .map((x) => x.money)
      .filter((y) => typeof y === "number")
      .reduce((money, sum) => money + sum, 0);

    return res.json({ ok: true, userCount, adminCount, totalMoney });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
