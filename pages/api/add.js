import nc from "next-connect";
import gun from "../../components/vimeGun";

const handler = nc({
  onError: function (err, req, res) {
    res.json({ err: true, msg: "Internal server error" });
  },
}).post((req, res) => {
  let { login, level } = req.body;

  // Validation
  login = login.replace(/[^A-Za-z0-9_]/g, "");
  level = isNaN(parseInt(level)) ? 0 : parseInt(level);

  if (login.length <= 0) {
    return res.json({ err: true, msg: "Login is too short!" });
  }
  if (login.length >= 17) {
    return res.json({ err: true, msg: "Login is too long!" });
  }

  let tmp = gun.get(login).put({ login, level });
  gun.get("vimeAccs").set(tmp, () => {
    return res.json({ err: false, msg: "Account added successfully" });
  });
});

export default handler;
