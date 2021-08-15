import {
  Typography,
  responsiveFontSizes,
  createTheme,
  ThemeProvider,
  List,
  ListItem,
  makeStyles,
  CssBaseline,
  Paper,
  Grid,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import Link from "next/link";
import MoreVert from "@material-ui/icons/MoreVert";
import DeleteForever from "@material-ui/icons/DeleteForever";
import { green, purple } from "@material-ui/core/colors";
import { useEffect, useState } from "react";
import Gun from "gun";
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
  paper: {
    flexGrow: 1,
    [theme.breakpoints.up("md")]: {
      padding: "0.5rem",
    },
  },
  paperContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
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
  link: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
  randomButtonContainer: {
    display: "flex",
    flexDirection: "row",
    padding: "0.75rem",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  randomButton: {
    marginRight: "0.25rem",
  },
}));

export default function Index() {
  const classes = useStyles();
  const gun = Gun("https://mvp-gun.herokuapp.com/gun");

  /**
   * data contains accounts that are shown on the screen,
   * while allAccounts contains all of the accounts(duh).
   * Why? So that random selecting, and reverting back to all accounts
   * is painless and without any latency whatsoever.
   * As in, I won't have to fetch all of the accounts again.
   */

  let [data, setData] = useState([]);
  let [allAccounts, setAllAccounts] = useState();

  useEffect(() => {
    let tmp = [];
    /**
     * There's a lot happening here:
     * First of all, deleted or not existing/wrongly added accounts can be undefined
     * or null, which is why I check this first.
     * In the data that is returned, every key is a login of an existing account
     * except for "_", which contains meta data that we don't need.
     *
     * Because no proper deletion method worked, I had to
     * Put login and level of deleted account as null, which I have to check.
     * That's about it
     */
    gun.get("vime-accs").once((data) => {
      if (typeof data !== "undefined" && data !== null) {
        Object.keys(data)
          .filter((key) => key !== "_")
          .forEach((login) => {
            gun.get(login).once((acc) => {
              if (typeof acc?.login !== "undefined" && acc?.login !== null) {
                tmp = [...tmp, { login: acc.login, level: acc.level }];
                tmp.sort((acc1, acc2) => acc2.level - acc1.level);
                setAllAccounts(tmp);
                setData(tmp);
              }
            });
          });
      }
    });
  }, []);

  let [anchorEl, setAnchorEl] = useState(null);
  let isMenuOpen = Boolean(anchorEl);

  let [isDialogOpen, setIsDialogOpen] = useState(false);
  // Login that is to be deleted, will be shown in the Dialog
  let [delLogin, setDelLogin] = useState("");

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const below5Func = () => {
    if (typeof data !== "undefined" && data?.length !== 0) {
      let tmp = data.filter((acc) => acc.level < 5);
      setData(tmp);
      setAnchorEl(null);
    }
  };

  const showAll = () => {
    setData(allAccounts);
    setAnchorEl(null);
  };

  const selectRandom = () => {
    if (allAccounts.length !== 0) {
      let randomAcc =
        allAccounts[Math.floor(Math.random() * allAccounts.length)];

      setData([randomAcc]);
      setAnchorEl(null);
    } else {
      alert("Dalped, first add some accounts or select all");
    }
  };

  const selectRandomBelow5 = () => {
    if (allAccounts.length !== 0) {
      let tmp = allAccounts.filter((acc) => acc.level < 5);
      if (tmp.length === 0) {
        alert("No accounts below level 5");
      } else {
        let randomAcc = tmp[Math.floor(Math.random() * tmp.length)];

        setData([randomAcc]);
        setAnchorEl(null);
      }
    } else {
      alert("Dalped, first add some accounts or select all");
    }
  };

  const deleteAccount = (login) => {
    // TODO: optimize this, by either subscribing to changes, or doing something else
    gun.get(login).put({ login: null, level: null }, () => {
      setAllAccounts(allAccounts.filter((acc) => acc.login != login));
      setData(data.filter((acc) => acc.login != login));
    });
  };

  const cancelDialog = () => {
    setIsDialogOpen(false);
    setDelLogin("");
  };

  const deleteDialog = () => {
    deleteAccount(delLogin);
    setIsDialogOpen(false);
    setDelLogin("");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="Description"
          content="vime-accounts - add and change Pipirok's vime accounts (for personal use)"
        />
        <title>vime-accounts by Pipirok</title>
        <meta name="theme-color" content="#9c27b0" />
      </Head>
      <div className={classes.grow}>
        <AppBar className={classes.appbar} position="sticky">
          <Toolbar>
            <Typography variant="h4" className={classes.grow}>
              Vime Accounts
            </Typography>
            {/* pc section */}
            <div className={classes.sectionPC}>
              <Link href="/add">
                <Button
                  className={classes.button}
                  variant="contained"
                  color="secondary"
                  href="/add"
                >
                  Add
                </Button>
              </Link>
              <Button
                className={classes.button}
                variant="contained"
                color="secondary"
                onClick={below5Func}
              >
                Below 5
              </Button>
              <Button
                className={classes.button}
                variant="outlined"
                color="secondary"
                onClick={showAll}
              >
                All
              </Button>
            </div>
            {/* mobile section */}
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
          <Link href="/add" className={classes.link}>
            <MenuItem>Add account</MenuItem>
          </Link>

          <MenuItem onClick={below5Func}>Accounts below lvl 5</MenuItem>
          <MenuItem onClick={showAll}>Show all</MenuItem>
          <MenuItem onClick={selectRandom}>Select random acc</MenuItem>
          <MenuItem onClick={selectRandomBelow5}>
            Select random below 5
          </MenuItem>
        </Menu>
      </div>
      <Grid container style={{ flexGrow: 1, paddingTop: "1rem" }}>
        <Grid item xs={1} md={2} lg={3} xl={4} />
        <Grid item style={{ paddingTop: "1rem" }}>
          {/* Random buttons */}
          <Typography variant="h2" component="h2">
            Accounts:
          </Typography>
          <div className={classes.randomButtonContainer}>
            <Button
              size="large"
              onClick={selectRandom}
              variant="contained"
              color="secondary"
              className={classes.randomButton}
            >
              Random
            </Button>
            <Button
              size="large"
              onClick={selectRandomBelow5}
              variant="outlined"
              color="secondary"
              className={classes.randomButton}
            >
              Random below 5
            </Button>
          </div>
          <div className={classes.paperContainer}>
            <Paper className={classes.paper}>
              <List>
                {typeof data !== "undefined" && data.length !== 0 ? (
                  data.map((acc, i) => (
                    <ListItem key={i}>
                      <IconButton
                        onClick={() => {
                          setDelLogin(acc.login);
                          setIsDialogOpen(true);
                        }}
                      >
                        <DeleteForever color="error" fontSize="large" />
                      </IconButton>
                      <Typography variant="h4">
                        {`${acc.login} - ${acc.level}`}
                      </Typography>
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="h4" style={{ padding: "0.5rem" }}>
                    Nothing here!
                  </Typography>
                )}
              </List>
            </Paper>
          </div>
          <Dialog
            open={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
            }}
          >
            <DialogTitle>Delete account {delLogin}?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Click 'Delete' to permamently delete {delLogin} from the list or
                'Cancel' to abort. You can always re-enter it from the add page.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="secondary" onClick={cancelDialog}>
                Cancel
              </Button>
              <Button style={{ color: "red" }} onClick={deleteDialog}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Grid item xs={1} md={2} lg={3} xl={4} />
      </Grid>
    </ThemeProvider>
  );
}
