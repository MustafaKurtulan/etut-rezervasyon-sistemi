import { AppBar, Box, Button, Stack, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router";
import { logout } from "../pages/accountSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

const navBtnSx = {
  color: "#fff",
  fontWeight: 500,
  fontSize: ".85rem",
  letterSpacing: ".08em",
  textTransform: "uppercase",
  fontFamily: '"Montserrat", sans-serif',
  "&:hover": { opacity: 0.85, background: "transparent" },
  "&.active": {
    color: "#fff",
    "&::after": {
      content: '""',
      display: "block",
      height: 2,
      background: "#fff",
      borderRadius: 1,
      mt: 0.6,
    },
  },
} as const;

export default function Header() {
  const { user } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();

  const isAdmin =
    !!user &&
    Array.isArray((user as any).roles) &&
    ((user as any).roles as string[]).includes("Admin");

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "transparent",
        boxShadow: "none",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          width: "100%",
          px: 0,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            ml: 2,
            fontWeight: 700,
            letterSpacing: ".05em",
            fontSize: "1.1rem",
            fontFamily: '"Montserrat", sans-serif',
          }}
        >
          Etut-Rezervasyon
        </Typography>

        {/* Sağ taraf */}
        {!user ? (
          // Giriş yoksa: sadece Home / Login / Register
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mr: 2 }}>
            <Button component={NavLink} to="/" disableRipple sx={navBtnSx}>
              Home
            </Button>
            <Button component={NavLink} to="/login" disableRipple sx={navBtnSx}>
              Login
            </Button>
            <Button component={NavLink} to="/register" disableRipple sx={navBtnSx}>
              Register
            </Button>
          </Box>
        ) : (
          // Giriş varsa: Desks + (Admin ise Users) + isim + logout
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mr: 2 }}>
            <Button component={NavLink} to="/desks" disableRipple sx={navBtnSx}>
              Desks
            </Button>
            <Button component={NavLink} to="Error" disableRipple sx={navBtnSx}>
              Error
            </Button>
            {isAdmin && (
              <Button component={NavLink} to="/users" disableRipple sx={navBtnSx}>
                Users
              </Button>
              
            )}

            <Stack direction="row" spacing={1.5}>
              <Button disableRipple sx={navBtnSx}>
                {user.name}
              </Button>
              <Button disableRipple sx={navBtnSx} onClick={() => dispatch(logout())}>
                LOG OUT
              </Button>
            </Stack>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
