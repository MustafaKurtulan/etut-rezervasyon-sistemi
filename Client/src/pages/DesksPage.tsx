import * as React from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography, Paper, MenuItem, Switch, FormControlLabel, Tooltip } from "@mui/material";

import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import requests from "../api/request";
import { toast } from "react-toastify";

type DeskRow = { //DataGrid de gösterilen satır verisi
  id: number;
  roomId: number;
  roomName?: string;
  roomLocation?: string;
  deskNumber: string;
  isActive: boolean;
  createdAt?: string | null;

  createdByUserId?: string | null;
  createdByUsername?: string | null;
};

type DeskForm = {
  id?: number;
  roomId: number | "";
  deskNumber: string;
  isActive: boolean;
};

const ROOM_IDS = [1, 2, 3, 4];

function decodeJwt(token?: string) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getRolesFromToken(token?: string): string[] {
  const p = decodeJwt(token);
  if (!p) return [];
  const raw =
    p["role"] ||
    p["roles"] ||
    p["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (!raw) return [];
  return Array.isArray(raw) ? raw : [String(raw)];
}

function getUserIdFromToken(token?: string): string {
  const p = decodeJwt(token);
  if (!p) return "";
  return (
    p["id"] ||
    p["nameid"] ||
    p["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
    ""
  );
}

export default function DesksPage() {
  const currentUser = React.useMemo(() => { //gereksiz hesaplamaları önler
    try {
      return JSON.parse(localStorage.getItem("user") || "null") ?? {};
    } catch {
      return {};
    }
  }, []);

  const token: string = currentUser?.token ?? "";
  const roles = React.useMemo(() => getRolesFromToken(token), [token]);
  const isAdmin = roles.includes("Admin");

  const currentUserId = React.useMemo(() => getUserIdFromToken(token), [token]);

  const [rows, setRows] = React.useState<DeskRow[]>([]);
  const [loading, setLoading] = React.useState(true); //component içinde değişken tutar

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<DeskRow | null>(null);

  const [form, setForm] = React.useState<DeskForm>({
    roomId: "",
    deskNumber: "",
    isActive: true,
  });

  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await requests.Desks.list();
      const normalized: DeskRow[] = (data as any[]).map((x) => ({
        id: x.id ?? x.Id,
        roomId: x.roomId ?? x.RoomId,
        roomName: x.roomName ?? x.RoomName,
        roomLocation: x.roomLocation ?? x.RoomLocation,
        deskNumber: String(x.deskNumber ?? x.DeskNumber ?? ""),
        isActive: Boolean(x.isActive ?? x.IsActive),
        createdAt: x.createdAt ?? x.CreatedAt ?? null,
        createdByUserId: x.createdByUserId ?? x.CreatedByUserId ?? null,
        createdByUsername: x.createdByUsername ?? x.CreatedByUsername ?? null,
      }));
      setRows(normalized);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { //veri çekmek
    fetchData();
  }, [fetchData]);

  const canManageRow = React.useCallback(
    (row: DeskRow) => {
      if (isAdmin) return true;
      if (!row.createdByUserId) return false;
      if (!currentUserId) return false;
      return row.createdByUserId === currentUserId;
    },
    [isAdmin, currentUserId]
  );

  const openCreate = () => {
    setEditing(null);
    setForm({ roomId: "", deskNumber: "", isActive: true });
    setOpen(true);
  };

  const openEdit = (row: DeskRow) => {
    if (!canManageRow(row)) {
      toast.error("Bu kaydı düzenleme yetkin yok.");
      return;
    }

    setEditing(row);
    setForm({
      id: row.id,
      roomId: row.roomId,
      deskNumber: String(row.deskNumber),
      isActive: row.isActive,
    });
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setEditing(null);
  };

  const validateForm = () => {
    if (form.roomId === "") {
      toast.error("RoomId zorunlu.");
      return false;
    }
    const roomIdNum = Number(form.roomId);
    if (!ROOM_IDS.includes(roomIdNum)) {
      toast.error("RoomId sadece 1-4 olabilir.");
      return false;
    }

    const deskStr = form.deskNumber.trim();
    if (!deskStr) {
      toast.error("Desk Number zorunlu.");
      return false;
    }
    if (!/^\d+$/.test(deskStr)) {
      toast.error("Desk Number sadece sayı olmalı (1-100).");
      return false;
    }

    const deskNum = Number(deskStr);
    if (deskNum < 1 || deskNum > 100) {
      toast.error("Desk Number sadece 1-100 arasında olabilir.");
      return false;
    }

    const duplicate = rows.some(
      (r) =>
        r.roomId === roomIdNum &&
        String(r.deskNumber) === String(deskNum) &&
        r.id !== (editing?.id ?? -1)
    );

    if (duplicate) {
      toast.error("Bu RoomId içinde bu Desk Number zaten var.");
      return false;
    }

    return true;
  };

  const saveDesk = async () => {
    if (!validateForm()) return;

    if (editing && !canManageRow(editing)) {
      toast.error("Bu kaydı güncelleme yetkin yok.");
      return;
    }

    const payload = {
      roomId: Number(form.roomId),
      deskNumber: String(Number(form.deskNumber.trim())), // normalize
      isActive: form.isActive,
    };

    try {
      if (!editing) {
        await requests.Desks.create(payload);
        toast.success("Desk oluşturuldu");
      } else {
        await requests.Desks.update(editing.id, { id: editing.id, ...payload });
        toast.success("Desk güncellendi");
      }

      closeDialog();
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const confirmDelete = (row: DeskRow) => {
    if (!canManageRow(row)) {
      toast.error("Bu kaydı silme yetkin yok.");
      return;
    }
    setDeleteId(row.id);
  };

  const doDelete = async () => {
    if (deleteId == null) return;

    const row = rows.find((r) => r.id === deleteId);
    if (row && !canManageRow(row)) {
      toast.error("Bu kaydı silme yetkin yok.");
      setDeleteId(null);
      return;
    }

    try {
      await requests.Desks.delete(deleteId);
      toast.success("Desk silindi");
      setDeleteId(null);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const ownerInfoMissingForNonAdmin =
    !isAdmin && rows.length > 0 && rows.every((r) => !r.createdByUserId);

  const columns = React.useMemo<GridColDef<DeskRow>[]>(() => {
    return [
      { field: "id", headerName: "ID", width: 70 },
      { field: "roomId", headerName: "RoomId", width: 90 },
      { field: "roomName", headerName: "Room Name", width: 160 },
      { field: "roomLocation", headerName: "Room Location", width: 180 },
      { field: "deskNumber", headerName: "Desk Number", width: 140 },
      {
        field: "isActive",
        headerName: "Active",
        width: 110,
        sortable: false,
        renderCell: (params) =>
          params.value ? <CheckIcon fontSize="small" /> : <CloseIcon fontSize="small" />,
      },
      {
        field: "createdAt",
        headerName: "Created At",
        width: 200,
        valueFormatter: (params: any) => {
          const raw = params.value as string | null | undefined;
          if (!raw) return "-";
          const d = new Date(raw);
          return isNaN(d.getTime()) ? "-" : d.toLocaleString("tr-TR");
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 140,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams<DeskRow>) => {
          const allowed = canManageRow(params.row);
          const tip = isAdmin
            ? "Admin: düzenle/sil"
            : allowed
            ? "Kendi kaydın: düzenle/sil"
            : "Sadece kendi eklediklerini düzenleyebilirsin";

          return (
            <Stack direction="row" spacing={1}>
              <Tooltip title={tip}>
                <span>
                  <IconButton size="small" onClick={() => openEdit(params.row)} disabled={!allowed}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title={tip}>
                <span>
                  <IconButton size="small" onClick={() => confirmDelete(params.row)} disabled={!allowed}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          );
        },
      },
    ];
  }, [canManageRow, isAdmin]);

  const roomIdError = form.roomId !== "" && !ROOM_IDS.includes(Number(form.roomId));

  const deskNumberNum = /^\d+$/.test(form.deskNumber.trim())
    ? Number(form.deskNumber.trim())
    : NaN;

  const deskNumberError =
    form.deskNumber.trim() !== "" &&
    (!/^\d+$/.test(form.deskNumber.trim()) || deskNumberNum < 1 || deskNumberNum > 100);

  const duplicateError =
    form.roomId !== "" &&
    /^\d+$/.test(form.deskNumber.trim()) &&
    rows.some(
      (r) =>
        r.roomId === Number(form.roomId) &&
        String(r.deskNumber) === String(Number(form.deskNumber.trim())) &&
        r.id !== (editing?.id ?? -1)
    );

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        color: "#fff",
        backgroundImage: "url('/images/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Paper elevation={6} sx={{ width: "min(1200px, 100%)", p: 2, borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Desks
          </Typography>

          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            New Desk
          </Button>
        </Stack>

        {ownerInfoMissingForNonAdmin && (
          <Typography variant="body2" sx={{ mb: 1, color: "error.main" }}>
            Not: API, Desk kaydının sahibini (CreatedByUserId) göndermediği için öğrenci edit/sil yapamaz.
            DeskDTO’ya CreatedByUserId ekleyip GET /desk listesinde döndürmelisin.
          </Typography>
        )}

        <Box sx={{ height: 420, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            getRowId={(r) => r.id}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
          />
        </Box>
      </Paper>

      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Edit Desk" : "New Desk"}</DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="RoomId (1-4)"
              value={form.roomId}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  roomId: e.target.value === "" ? "" : Number(e.target.value),
                }))
              }
              fullWidth
              error={roomIdError}
              helperText={roomIdError ? "RoomId sadece 1-4 olabilir." : "Sadece 1-4 seç."}
            >
              <MenuItem value="">Seç</MenuItem>
              {ROOM_IDS.map((id) => (
                <MenuItem key={id} value={id}>
                  {id}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Desk Number (1-100)"
              value={form.deskNumber}
              onChange={(e) => setForm((p) => ({ ...p, deskNumber: e.target.value }))}
              type="number"
              inputProps={{ min: 1, max: 100 }}
              fullWidth
              error={deskNumberError || duplicateError}
              helperText={
                duplicateError
                  ? "Bu RoomId içinde bu Desk Number zaten var."
                  : deskNumberError
                  ? "Desk Number sadece 1-100 arası sayı olmalı."
                  : "1 ile 100 arasında bir sayı gir."
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                />
              }
              label={form.isActive ? "Active" : "Passive"}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>İptal</Button>
          <Button
            variant="contained"
            onClick={saveDesk}
            disabled={roomIdError || deskNumberError || duplicateError || form.roomId === ""}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteId != null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Desk</DialogTitle>
        <DialogContent>Silmek istediğine emin misin?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Vazgeç</Button>
          <Button color="error" variant="contained" onClick={doDelete}>
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
