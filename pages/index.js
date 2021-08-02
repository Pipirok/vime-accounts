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
import { useState } from "react";
import { gun } from "./api/add";

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

function Index({ accs }) {
  const classes = useStyles();

  let [data, changeData] = useState(accs);

  let [anchorEl, setAnchorEl] = useState(null);
  let isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const below5Func = () => {
    let tmp = data.filter((acc) => acc.level < 5);
    changeData(tmp);
    setAnchorEl(null);
  };

  const showAll = () => {
    changeData(accs);
    setAnchorEl(null);
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
      <Grid container style={{ flexGrow: 1 }}>
        <Grid item xs={1} md={2} lg={3} xl={4} />
        <Grid item style={{ paddingTop: "1rem" }}>
          <Typography variant="h2" component="h2">
            Accounts:
          </Typography>
          <Paper className={classes.paper}>
            <List>
              {data?.length !== 0 ? (
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

export const getServerSideProps = () => {
  let accs = [];
  // Yeah, I have no idea how to manage public data in Gun.js
  gun.get("vimeAccs").map((acc) => {
    if (typeof acc.login !== "undefined") {
      if (accs.includes({ login: acc.login, level: acc.level })) {
        return;
      }
      accs.push({ login: acc.login, level: acc.level });
      accs.sort((acc1, acc2) => acc2.level - acc1.level);
    }
  });

  return {
    props: {
      accs,
    },
  };
};

export default Index;
