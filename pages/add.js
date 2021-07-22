import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Menu,
  MenuItem,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  responsiveFontSizes,
  makeStyles,
  Snackbar,
  Paper,
  Grid,
  Divider,
  TextField,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Link from "next/link";
import { MoreVert } from "@material-ui/icons";
import { green, purple } from "@material-ui/core/colors";
import { useState } from "react";
import Gun from "gun";

let theme = createTheme({
  palette: {
    primary: purple,
    secondary: green,
    type: "dark",
  },
});

theme = responsiveFontSizes(theme);

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appbar: { padding: "0.25rem" },
  sectionMobile: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  sectionPC: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  button: {
    marginRight: theme.spacing(1),
  },
  paper: {
    width: "100%",
    padding: "1rem",
  },
  code: {
    background: "black",
    color: green[500],
    fontFamily: "Monospace",
  },
  form: {
    display: "flex",
    justifyContent: "space-evenly",
    padding: "0.5rem",
    marginBottom: "1rem",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
}));

export default function Add() {
  const classes = useStyles();

  const gun = new Gun([
    "https://vime-gun.vercel.app/",
    "mvp-gun.herokuapp.com",
  ]);

  let [anchorEl, setAnchorEl] = useState(null);
  let isMenuOpen = Boolean(anchorEl);

  let [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  let [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  let [snackbarMessage, setSnackbarMessage] = useState(null);

  let [formLogin, setFormLogin] = useState("");
  let [formLevel, setFormLevel] = useState("");
  let [delFormLogin, setDelFormLogin] = useState("");

  const handleLoginChange = (e) => {
    setFormLogin(e.target.value);
  };

  const handleDelLoginChange = (e) => {
    setDelFormLogin(e.target.value);
  };

  const handleLevelChange = (e) => {
    setFormLevel(e.target.value);
  };

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSuccessSnackbarClose = (e, reason) => {
    if (reason === "clickaway") return;
    setSuccessSnackbarOpen(false);
  };
  const handleErrorSnackbarClose = (e, reason) => {
    if (reason === "clickaway") return;
    setErrorSnackbarOpen(false);
  };

  const addAccount = (e) => {
    e.preventDefault();

    // Validation
    let login = formLogin;
    let level = formLevel;

    level = isNaN(parseInt(level)) ? 0 : parseInt(level);

    login = login.replace(/[^A-Za-z0-9_]/g, "");

    if (login.length <= 0 || login.length >= 17) {
      setSnackbarMessage("Login is too long!");
      setErrorSnackbarOpen(true);
      return;
    }

    let tmp = gun.get(login).put({ login, level });
    gun.get("vimeAccs").set(tmp, () => {
      setSnackbarMessage("Account added successfully!");
      setSuccessSnackbarOpen(true);
    });
  };

  const deleteAccount = (e) => {
    e.preventDefault();

    // Validation
    let login = delFormLogin;
    login = login.replace(/[^A-Za-z0-9_]/g, "");

    if (login.length <= 0 || login.length >= 17) {
      setSnackbarMessage("Login is too long/short!");
      setErrorSnackbarOpen(true);
      return;
    }

    let tmp = gun.get(login).put({ login: null, level: null });
    gun.get("vimeAccs").set(tmp);
    setSnackbarMessage("Account deleted successfully!");
    setSuccessSnackbarOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.grow}>
        <AppBar className={classes.appbar} position="sticky">
          <Toolbar>
            <Typography variant="h4" className={classes.grow}>
              Vime Accounts
            </Typography>
            {/* sectionPC */}
            <div className={classes.sectionPC}>
              <Link href="/">
                <Button
                  className={classes.button}
                  variant="contained"
                  color="secondary"
                  role="link"
                >
                  View accs
                </Button>
              </Link>
              <Button
                className={classes.button}
                variant="outlined"
                color="secondary"
                onClick={() => {
                  alert("Rechaching?");
                }}
              >
                Recache
              </Button>
            </div>
            {/* sectionMobile */}
            <IconButton
              size="medium"
              edge="end"
              className={classes.sectionMobile}
              onClick={handleMenuOpen}
            >
              <MoreVert />
            </IconButton>
          </Toolbar>
        </AppBar>
        {/* menu */}
        <Menu
          id="primary-account-actions-menu"
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <Link href="/">
            <MenuItem>View all Accounts</MenuItem>
          </Link>
          <MenuItem onClick={() => alert("Recaching?")}>Recache</MenuItem>
        </Menu>
      </div>
      <Grid container style={{ height: "100vh", paddingTop: "1rem" }}>
        <Grid item xs={1} md={2} lg={3} xl={4} />
        <Grid item xs={10} md={8} lg={6} xl={4} style={{ paddingTop: "1rem" }}>
          <Paper className={classes.paper}>
            <Typography gutterBottom variant="h2">
              Add an account(s)
            </Typography>
            <Divider />
            <Typography
              style={{ paddingTop: "0.5rem" }}
              gutterBottom
              variant="body1"
            >
              Press "Add" button to add an account. <br />
              To add more than one accounts, write all account names separated
              by a comma. (not implemented yet) <br />
              Example: <span className={classes.code}>Pipirok, dawwaq</span>
            </Typography>
            <form className={classes.form} onSubmit={addAccount}>
              <TextField
                label="Login"
                id="acc-login"
                required
                autoComplete="off"
                variant="outlined"
                type="text"
                value={formLogin}
                onChange={handleLoginChange}
              />
              <TextField
                label="Level"
                id="acc-level"
                required
                autoComplete="off"
                variant="outlined"
                type="number"
                value={formLevel}
                onChange={handleLevelChange}
              />
              <Button
                color="secondary"
                variant="contained"
                onClick={addAccount}
              >
                Add
              </Button>
            </form>
            <form className={classes.form} onSubmit={deleteAccount}>
              <Typography variant="body2">
                ! deletion does not work at the moment.
              </Typography>
              <TextField
                label="Login"
                id="acc-login"
                required
                autoComplete="off"
                variant="outlined"
                type="text"
                value={delFormLogin}
                onChange={handleDelLoginChange}
              />
              <Button
                color="secondary"
                variant="contained"
                onClick={deleteAccount}
              >
                Delete
              </Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={1} md={2} lg={3} xl={4} />
      </Grid>
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSuccessSnackbarClose}
      >
        <Alert
          elevation={6}
          onClose={handleSuccessSnackbarClose}
          severity="success"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleErrorSnackbarClose}
      >
        <Alert
          elevation={6}
          onClose={handleErrorSnackbarClose}
          severity="error"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
