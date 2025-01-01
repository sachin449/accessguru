import React, { useEffect, useState, useCallback } from "react";
import { getEmployees, deleteEmployee, addEmployee } from "../services/employeeService";
import AddUserModal from "./AddUserModal";
import config from "../config";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  MenuItem,
  Typography,
  Box,
  Chip,
  IconButton,
  Container,
  Alert,
  CircularProgress,
  Tooltip,
  Fade,
  TablePagination,
  Snackbar,
  Card,
  Stack,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  GitHub as GitHubIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const EmployeeDashboard = () => {
  const { token, orgName } = config.github;
  
  // State management
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchEmployees = useCallback(async () => {
    try {
      const data = await getEmployees();
      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        throw new Error('Invalid employee data format');
      }
    } catch (error) {
      setError("Failed to load employees. Please try again later.");
      console.error('Fetch employees error:', error);
    }
  }, []);

  const fetchRepositories = useCallback(async () => {
    try {
      const response = await fetch(`https://api.github.com/orgs/${orgName}/repos`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch repositories");

      const data = await response.json();
      setRepos(data);
    } catch (error) {
      setError("Failed to fetch repositories. Please check your connection.");
      console.error('Fetch repositories error:', error);
    }
  }, [orgName, token]);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchEmployees(), fetchRepositories()]);
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [fetchEmployees, fetchRepositories]);

  const showNotification = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    
    setIsProcessing(true);
    try {
      await deleteEmployee(id);
      setEmployees(prevEmployees => prevEmployees.filter(employee => employee._id !== id));
      setSelectedEmployeeId("");
      showNotification('Employee deleted successfully');
    } catch (error) {
      setError("Failed to delete employee. Please try again.");
      console.error('Delete error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCollaboratorAction = async (action) => {
    if (!selectedRepo || !selectedEmployeeId) {
      setError("Please select both a repository and an employee.");
      return;
    }

    setIsProcessing(true);
    const selectedEmployee = employees.find(emp => emp._id === selectedEmployeeId);
    const githubUsername = selectedEmployee?.platforms[0]?.accountId;

    if (!githubUsername) {
      setError("Selected employee has no GitHub account configured.");
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${selectedRepo}/collaborators/${githubUsername}`,
        {
          method: action === 'add' ? 'PUT' : 'DELETE',
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (response.status === 201 || response.status === 204) {
        showNotification(
          action === 'add' 
            ? `Successfully added ${githubUsername} as a collaborator`
            : `Successfully removed ${githubUsername} as a collaborator`
        );
      } else {
        throw new Error(`Failed with status: ${response.status}`);
      }
    } catch (error) {
      setError(`Failed to ${action} collaborator. Please try again.`);
      console.error('Collaborator action error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchEmployees(), fetchRepositories()]);
      showNotification('Data refreshed successfully');
    } catch (error) {
      setError('Failed to refresh data');
      console.error('Refresh error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (newEmployee) => {
    setIsProcessing(true);
    try {
      const addedEmployee = await addEmployee(newEmployee);
      if (!addedEmployee) {
        throw new Error('No response from add employee API');
      }
      
      // Update local state first
      setEmployees(prevEmployees => [...prevEmployees, addedEmployee.employee]);
      
      // Close modal and show success message
      setIsModalOpen(false);
      showNotification('Employee added successfully');
      
      // Optional: Refresh data in background
      fetchEmployees().catch(error => {
        console.error('Background refresh error:', error);
      });
      
    } catch (error) {
      showNotification(error.message || "Failed to add employee", 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4 
        }}>
          <Typography variant="h4" component="h1">
            Employee Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Refresh data">
              <IconButton 
                onClick={handleRefresh}
                disabled={isProcessing}
                color="primary"
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsModalOpen(true)}
              disabled={isProcessing}
            >
              Add Employee
            </Button>
          </Box>
        </Box>

        {error && (
          <Fade in={!!error}>
            <Alert 
              severity="error" 
              onClose={() => setError(null)}
              sx={{ mb: 3 }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Controls */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
          <TextField
            select
            label="Select Repository"
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
            disabled={isProcessing}
            sx={{ minWidth: 250 }}
          >
            <MenuItem value="">
              <em>Select Repository</em>
            </MenuItem>
            {repos.map((repo) => (
              <MenuItem key={repo.id} value={repo.full_name}>
                {repo.full_name}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            fullWidth
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isProcessing}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Stack>

        {/* Table */}
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Platform</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedEmployees.map((employee, index) => (
                <TableRow 
                  key={employee._id}
                  selected={selectedEmployeeId === employee._id}
                  hover
                >
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="body1">{employee.name}</Typography>
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    {employee.platforms.map((platform) => (
                      <Box key={platform._id} sx={{ display: 'flex', alignItems: 'center' }}>
                        <GitHubIcon sx={{ mr: 1, fontSize: 18 }} />
                        <Typography>{platform.accountId}</Typography>
                      </Box>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={employee.platforms[0]?.status || "N/A"}
                      color={employee.platforms[0]?.status === "active" ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        variant={selectedEmployeeId === employee._id ? "contained" : "outlined"}
                        onClick={() => setSelectedEmployeeId(employee._id)}
                        disabled={isProcessing}
                      >
                        Select
                      </Button>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(employee._id)}
                        disabled={isProcessing}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredEmployees.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </TableContainer>

        {/* Collaborator Actions */}
        {selectedRepo && selectedEmployeeId && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<PersonAddIcon />}
              onClick={() => handleCollaboratorAction('add')}
              disabled={isProcessing}
            >
              Add Collaborator
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<PersonRemoveIcon />}
              onClick={() => handleCollaboratorAction('remove')}
              disabled={isProcessing}
            >
              Remove Collaborator
            </Button>
          </Box>
        )}
      </Paper>

      {/* Add User Modal */}
      <AddUserModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddEmployee}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EmployeeDashboard;