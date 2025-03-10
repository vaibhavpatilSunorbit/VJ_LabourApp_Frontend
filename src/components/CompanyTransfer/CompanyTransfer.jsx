import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Select, MenuItem, Checkbox, FormControlLabel, Typography
} from '@mui/material';
import { API_BASE_URL } from '../../Data';

function CompanyTransfer() {
    const [labours, setLabours] = useState([]);
    const [selectedLabours, setSelectedLabours] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');

    useEffect(() => {
        fetchLabours();
        fetchProjects();
    }, []);

    const fetchLabours = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/insentive/getlaboursForCompanyTransfer`);
            setLabours(response.data);
        } catch (error) {
            console.error('Error fetching labours:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/projects`);
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleSelectLabour = (labourId) => {
        setSelectedLabours((prevSelected) =>
            prevSelected.includes(labourId)
                ? prevSelected.filter((id) => id !== labourId)
                : [...prevSelected, labourId]
        );
    };

    const handleSelectAllLabours = (event) => {
        if (event.target.checked) {
            setSelectedLabours(labours.map((labour) => labour.LabourID));
        } else {
            setSelectedLabours([]);
        }
    };

    const handleTransfer = async () => {
        try {
            await axios.post(`${API_BASE_URL}/insentive/transferLabours`, {
                labourIds: selectedLabours,
                newProject: selectedProject
            });
            fetchLabours();
            setSelectedLabours([]);
            setSelectedProject('');
        } catch (error) {
            console.error('Error transferring labours:', error);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Company Transfer
            </Typography>

            <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            indeterminate={
                                                selectedLabours.length > 0 &&
                                                selectedLabours.length < labours.length
                                            }
                                            checked={
                                                labours.length > 0 &&
                                                selectedLabours.length === labours.length
                                            }
                                            onChange={handleSelectAllLabours}
                                        />
                                    }
                                    label="Select All"
                                />
                            </TableCell>
                            <TableCell>Labour ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Project</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Current Company</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {labours.map((labour) => (
                            <TableRow key={labour.LabourID}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedLabours.includes(labour.LabourID)}
                                        onChange={() => handleSelectLabour(labour.LabourID)}
                                    />
                                </TableCell>
                                <TableCell>{labour.LabourID}</TableCell>
                                <TableCell>{labour.name}</TableCell>
                                <TableCell>{labour.projectName}</TableCell>
                                <TableCell>{labour.department}</TableCell>
                                <TableCell>{labour.companyName}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {selectedLabours.length > 0 && (
                <Box display="flex" justifyContent="space-between" mt={2}>
                    <Select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        displayEmpty
                        sx={{ minWidth: 200 }}
                    >
                        <MenuItem value="" disabled>Select New Project</MenuItem>
                        {projects.map((project) => (
                            <MenuItem key={project.Id} value={project.Id}>
                                {project.Business_Unit}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleTransfer}
                        disabled={!selectedProject}
                    >
                        Transfer Selected Labours
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default CompanyTransfer;
