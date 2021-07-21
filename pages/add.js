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
import axios from "axios";
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
    justifyContent: "flex-start",
    padding: "0.5rem",
  },
}));

export default function Add() {
  const classes = useStyles();

  const gun = new Gun("https://mvp-gun.herokuapp.com/gun");

  let [anchorEl, setAnchorEl] = useState(null);
  let isMenuOpen = Boolean(anchorEl);

  let [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  let [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  let [snackbarMessage, setSnackbarMessage] = useState(null);

  let [formLogin, setFormLogin] = useState("");
  let [formLevel, setFormLevel] = useState(0);

  const handleLoginChange = (e) => {
    setFormLogin(e.target.value);
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

  const addAccount = async (e) => {
    e.preventDefault();
    /* let { data } = await axios.post("/api/add", {
      login: formLogin,
      level: formLevel,
    });
    setSnackbarMessage(data.msg);
    if (data.error) {
      setErrorSnackbarOpen(true);
    } else {
      setSuccessSnackbarOpen(true);
    } */
    let tmp = await gun
      .get(formLogin)
      .put({ login: formLogin, level: formLevel });
    await gun.get("vimeAccs").set(tmp);
  };

  const logAll = () => {
    gun.get("vimeAccs").map((acc) => console.log(acc.login));
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
        <Grid item style={{ paddingTop: "1rem" }}>
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
              <Button color="secondary" variant="contained" onClick={logAll}>
                log
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
