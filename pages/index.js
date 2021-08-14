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
} from "@material-ui/core";
import Link from "next/link";
import MoreVert from "@material-ui/icons/MoreVert";
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

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "100%",
    padding: "1rem",
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
}));

export default function Index() {
  const classes = useStyles();
  const gun = Gun("https://mvp-gun.herokuapp.com/gun");

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
    gun.get("vime-accs").on((data) => {
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
    }, true);
  }, []);

  let [anchorEl, setAnchorEl] = useState(null);
  let isMenuOpen = Boolean(anchorEl);

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
        <Menu
          id="primary-account-actions-menu"
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
        </Menu>
      </div>
      <Grid container style={{ flexGrow: 1, paddingTop: "1rem" }}>
        <Grid item xs={1} md={2} lg={3} xl={4} />
        <Grid item style={{ paddingTop: "1rem" }}>
          <Typography variant="h2" component="h2">
            Accounts:
          </Typography>
          <Paper className={classes.paper}>
            <List>
              {typeof data !== "undefined" && data.length !== 0 ? (
                data.map((acc, i) => (
                  <ListItem key={i}>
                    <Typography variant="h4">
                      {`${acc.login} - ${acc.level}`}
                    </Typography>
                  </ListItem>
                ))
              ) : (
                <Typography variant="h4">Nothing here!</Typography>
              )}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={1} md={2} lg={3} xl={4} />
      </Grid>
    </ThemeProvider>
  );
}
