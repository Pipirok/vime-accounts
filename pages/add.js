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
import { useEffect, useState } from "react";
import Gun from "gun";
import "gun/lib/unset";
import Head from "next/head";

let theme = createTheme({
  palette: {
    primary: purple,
    secondary: green,
    type: "dark",
  },
});

theme = responsiveFontSizes(theme);

// Material-ui styling
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

    padding: "0.5rem",
    marginBottom: "1rem",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      justifyContent: "center",
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      justifyContent: "space-evenly",
    },
  },
  formInput: {
    [theme.breakpoints.down("xs")]: {
      marginBottom: "0.5rem",
    },
    [theme.breakpoints.up("sm")]: {
      marginRight: "0.25rem",
    },
  },
  link: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
}));

export default function Add() {
  const classes = useStyles();

  const gun = Gun("https://mvp-gun.herokuapp.com/gun");

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

    if (login.length <= 2) {
      setSnackbarMessage("Login is too long!");
      setErrorSnackbarOpen(true);
      return;
    }

    if (login.length >= 17) {
      setSnackbarMessage("Login is too long!");
      setErrorSnackbarOpen(true);
      return;
    }

    let acc = gun.get(login).put({ login, level });
    gun.get("vime-accs").set(acc, () => {
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

    /**
     * .path() raised the "x is not a function" error, and unset
     * didn't work, so I had to do this. Makeshift, but it works!
     */
    gun.get(login).put({ login: null, level: null }, () => {
      setSnackbarMessage("Account deleted successfully!");
      setSuccessSnackbarOpen(true);
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="Description"
          content="vime-accounts - add and change Pipirok's vimeworld.ru accounts (for personal use)"
        />
        <title>vime-accounts by Pipirok - add or Delete</title>
        <meta name="theme-color" content="#9c27b0" />
      </Head>
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
          <Link href="/" className={classes.link}>
            <MenuItem>View all Accounts</MenuItem>
          </Link>
          <MenuItem
            onClick={() =>
              alert("Recaching is not working yet! Dur get burdan kopoglu")
            }
          >
            Recache
          </MenuItem>
        </Menu>
      </div>
      <Grid container style={{ flexGrow: 1, paddingTop: "1rem" }}>
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
                className={classes.formInput}
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
                className={classes.formInput}
              />
              <Button
                color="secondary"
                variant="contained"
                onClick={addAccount}
              >
                Add
              </Button>
            </form>
            <Divider />
            <Typography gutterBottom variant="h2">
              Delete an account
            </Typography>
            <Divider />
            <Typography
              style={{ paddingTop: "0.5rem" }}
              gutterBottom
              variant="body1"
            >
              Enter the login you want to delete, and click the "delete" button.
              If the acc exists, it will be deleted.
            </Typography>
            <form className={classes.form} onSubmit={deleteAccount}>
              <TextField
                label="Login"
                id="acc-login"
                required
                autoComplete="off"
                variant="outlined"
                type="text"
                value={delFormLogin}
                onChange={handleDelLoginChange}
                className={classes.formInput}
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
