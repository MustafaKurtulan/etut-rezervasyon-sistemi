import { useEffect, useMemo, useState } from "react";
import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import requests from "../api/request";
import { useNavigate } from "react-router";

type UserRow = {
  id: string;
  userName: string;
  name?: string | null;
  email?: string | null;
  roles: string[];
};

export default function UsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { roles = [] } = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null") ?? {};
    } catch {
      return {};
    }
  }, []);

  const isAdmin = Array.isArray(roles) ? roles.includes("Admin") : roles === "Admin";

  useEffect(() => {
    if (!isAdmin) {
      navigate("/unauthorized", { replace: true });
      return;
    }
    setLoading(true);
    requests.Users.list()
      .then((data: any[]) => {
        const mapped: UserRow[] = data.map((u) => ({
          id: u.id,
          userName: u.userName,
          name: u.name,
          email: u.email,
          roles: u.roles ?? [],
        }));
        setRows(mapped);
      })
      .finally(() => setLoading(false));
  }, [isAdmin, navigate]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "userName", headerName: "Username", width: 180 },
    { field: "name", headerName: "Name", width: 180 },
    { field: "email", headerName: "Email", width: 240 },
    {
      field: "roles",
      headerName: "Roles",
      width: 200,
      valueGetter: (_, row) => (row.roles?.length ? row.roles.join(", ") : ""),
    },
  ];

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: "40px",
        color: "#fff",
        backgroundImage: "url('/images/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
          p: 2,
          borderRadius: 3,
          bgcolor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(6px)",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          autoHeight
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
}
