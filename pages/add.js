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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Link from "next/link";
import { MoreVert } from "@material-ui/icons";
import { green, purple } from "@material-ui/core/colors";
import { useEffect, useState } from "react";
import Gun from "gun";
import Head from "next/head";
import axios from "axios";

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

  const gun = Gun();

  useEffect(() => {
    /**
     * For some reason, useEffect unmounting doesn't work in nextjs,
     * so I am unsubscribing from unneeded updates here.
     */
    gun.get("accs").off();
  }, []);

  let [anchorEl, setAnchorEl] = useState(null);
  let isMenuOpen = Boolean(anchorEl);

  let [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  let [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  let [snackbarMessage, setSnackbarMessage] = useState(null);

  let [isDialogOpen, setIsDialogOpen] = useState(false);
  let [dialogLogin, setDialogLogin] = useState(null);
  let [dialogLevel, setDialogLevel] = useState(null);

  // User input values
  let [formLogin, setFormLogin] = useState("");
  let [delFormLogin, setDelFormLogin] = useState("");

  const handleLoginChange = (e) => {
    setFormLogin(e.target.value);
  };

  const handleDelLoginChange = (e) => {
    setDelFormLogin(e.target.value);
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

    let login = formLogin;

    // Validation

    login = login.replace(/[^A-Za-z0-9_]/g, "");

    if (login.length <= 2) {
      setSnackbarMessage("Login is too short!");
      setErrorSnackbarOpen(true);
      return;
    }

    if (login.length >= 17) {
      setSnackbarMessage("Login is too long!");
      setErrorSnackbarOpen(true);
      return;
    }

    // Fetching account details from vimeworld in case it exists
    let fetchedDetails = await (
      await axios.get(`https://api.vimeworld.ru/user/name/${login}`)
    ).data;

    if (fetchedDetails.length === 0) {
      setDialogLevel(-1);
      setDialogLogin(login);
      setIsDialogOpen(true);
    } else {
      setDialogLevel(fetchedDetails[0].level);
      setDialogLogin(fetchedDetails[0].username);
      setIsDialogOpen(true);
    }
  };

  const confirmDialog = () => {
    setIsDialogOpen(false);
    setDialogLevel(null);
    setDialogLogin(null);
    let acc = gun
      .get(dialogLevel)
      .put({ login: dialogLogin, level: dialogLevel });
    gun.get("accs").set(acc, () => {
      setSnackbarMessage(`Account ${dialogLogin} added!`);
      setSuccessSnackbarOpen(true);
    });
  };

  const deleteAccount = (e) => {
    e.preventDefault();

    // Validation
    let login = delFormLogin;
    login = login.replace(/[^A-Za-z0-9_]/g, "");

    if (login.length <= 0) {
      setSnackbarMessage("Login is too short!");
      setErrorSnackbarOpen(true);
      return;
    }
    if (login.length >= 17) {
      setSnackbarMessage("Login is too long!");
      setErrorSnackbarOpen(true);
      return;
    }

    /**
     * .path() raised the "x is not a function" error, and .unset()
     * didn't work, so I had to do this. Makeshift, but it works!
     *
     * Once/if the documents are updated, will definitely fix this.
     */
    let accToDelete = gun.get(login);

    accToDelete.put({ login: null, level: null }, () => {
      setSnackbarMessage("Account deleted successfully!");
      setSuccessSnackbarOpen(true);
      gun.get("accs").once((data) => console.log(data));
    });
  };

  const recache = () => {
    let accs = [];

    /**
     * GunDB doesn't work with `await` (as I'm writing this),
     * so I am putting everything in one callback.
     * However, I will be using proper `async/await` inside of it.
     */

    gun.get("accs").once(async (data) => {
      if (typeof data !== "undefined" && data !== null) {
        Object.keys(data)
          .filter((key) => key !== "_")
          .forEach((acc) => {
            if (typeof acc !== "undefined" && acc.login !== null) {
              accs.push(acc);
            }
          });
      }

      if (accs.length > 0) {
        /**
         * This was the only way to get the C-style division working...
         * There probably is a better way to get a full number when doing divising.
         * Also, main operations start here.
         *
         * Now, to explain all of this:
         * The API I'm calling supports info on up to 50 accounts at once.
         * So, in order not to waste requests, I am going to get as much data as I
         * can in a single request.
         * For this though, I need to iterate over my accounts array in chunks of 50.
         * This code does exactly that.
         **/

        /**
         * for loops in react work a bit janky, so TODO: test if this works properly.
         * If it doesn't, replace it with something like `Array(parseInt((accs.length / 50).toFixed()) + 1).forEach()....
         */
        for (let i = 0; i < parseInt((accs.length / 50).toFixed()) + 1; i++) {
          let tmp = accs.slice(50 * i, 50 + 50 * i);
          try {
            // Looks a bit ugly, but without using the second `await` it returns `undefined`
            let newAccData = await (
              await axios.get(
                `https://api.vimeworld.ru/user/name/${tmp.join(",")}`
              )
            ).data;

            if (newAccData?.length === 0 || typeof newAccData === "undefined") {
              throw new Error("No accounts found!");
            }

            /**
             * Dilemma: logins returned from API are not always written the same
             * as the ones stored by GunDB. However, I want to retain the ones in
             * GunDB BUT also update account info. There are two possible solutions:
             * 1. Fetch the login from API, as well as level (will probably do that later)
             * 2. Iterate through both arrays (logins from GunDB and info returned from API)
             *    at the same time. If any account is missing from API response, then it means that
             *    it isn't registered. I'll put level=-1 for them, just to tell them apart from the rest.
             *
             * Note from the future: second method doesn't work, because loop dispatches same GunDB
             * .get() without updating the indexes. If only GunDB supported `await`...
             *
             * Note from even further in the future: settled for the slightky altered second method:
             * going to iterate through both arrays and will use GunDB ONLY to update the values.
             * There's just one catch with this: deleted accounts will also get updated.
             */

            let returnedLoginsIndex = 0;
            let updatedAccs = [];
            accs.forEach((acc) => {
              /**
               * Initially, I wanted to simply loop through both arrays, and update accounts
               * after it finished filling up new details. However, as I'm writing this,
               * there's no working way to remove an element from a set in GunDB.
               * Because of that, and the fact that `accs` holds even the deleted logins,
               * I'll have get each of them individually, in every iteration of the loop.
               * All of this, just because .unset() doesn't work and .path() is deprecated.
               *
               *
               * Update: realised I can just loop through the bigger array and keep the index
               * of the second one separately.
               * `return` in this case acts as a 'substitute' to `continue`.
               */

              let returnedLogin =
                newAccData[returnedLoginsIndex]?.username || "";

              if (acc.toLowerCase() === returnedLogin.toLowerCase()) {
                updatedAccs.push({
                  login: acc,
                  level: newAccData[returnedLoginsIndex].level,
                });
                console.log(`Matched - ${acc}`);
                returnedLoginsIndex++;
                return;
              } else {
                updatedAccs.push({ login: acc, level: -1 });
                console.log(`Didn't match... - ${acc}`);
                return;
              }
            });

            setSnackbarMessage("Info fetched succesfully! Updating...");
            setSuccessSnackbarOpen(true);
            updatedAccs.forEach((updatedAcc) => {
              gun.get(updatedAcc.login).once((existingAcc) => {
                if (existingAcc.login !== null) {
                  gun.get(updatedAcc.login).put(updatedAcc, () => {
                    setSuccessSnackbarOpen(false);
                    setSnackbarMessage(`Updated ${updatedAcc.login}`);
                    setSuccessSnackbarOpen(true);
                  });
                } else {
                  setSuccessSnackbarOpen(false);
                  setSnackbarMessage(
                    `Skipping ${updatedAcc.login} since it's deleted...`
                  );
                  setSuccessSnackbarOpen(true);
                }
              });
            });
          } catch (e) {
            /**
             * All errors are going to end up here, thanks to modern JavaScript.
             * This isn't handling them, but since I'm probably going to be the only one
             * to use this site, all I need is to see some info on the error that happened.
             */
            setSnackbarMessage(`Something went wrong - ${e.message}
            Try recaching again.
            `);
            setErrorSnackbarOpen(true);
          }
        }
      } else {
        setSnackbarMessage("There are no accounts - start by adding some!");
        setErrorSnackbarOpen(true);
      }
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
                onClick={recache}
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
          id="primary-actions-menu"
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
          <MenuItem onClick={recache}>Recache</MenuItem>
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
      {/* Just some snackbars and a dialog not rendered by default */}
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={2000}
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
        autoHideDuration={2000}
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
      <Dialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
      >
        <DialogTitle>Add user {dialogLogin}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to add {dialogLogin} who{" "}
            {dialogLevel !== -1
              ? `has level ${dialogLevel}`
              : "is unregistered"}
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ color: "red" }}
            onClick={() => {
              setIsDialogOpen(false);
              setDialogLevel(null);
              setDialogLogin(null);
            }}
          >
            Cancel
          </Button>
          <Button color="secondary" onClick={confirmDialog}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
