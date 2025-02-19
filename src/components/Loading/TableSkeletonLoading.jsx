import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box, Skeleton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const TableSkeletonLoading = ({ rows = 5, columns = 13 }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <TableContainer
            component={Paper}
            sx={{
                mb: isMobile ? 6 : 0,
                overflowX: 'auto',
                borderRadius: 2,
                boxShadow: 3,
                mt:-1,
                maxHeight: isMobile ? 'calc(100vh - 64px)' : 'calc(75vh - 64px)',
                '&::-webkit-scrollbar': { width: '8px' },
                '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '4px' },
            }}
        >
            <Box sx={{ width: '100%' }}>
                <Table stickyHeader sx={{ minWidth: 800 }}>
                    {/* <TableHead>
                        <TableRow>
                            {Array.from({ length: columns }).map((_, index) => (
                                <TableCell key={index}>
                                    <Skeleton variant="text" width={45} height={24} />
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead> */}
                    <TableBody>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <TableCell key={colIndex}>
                                        <Skeleton variant="rectangular" width={60} height={27} />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </TableContainer>
    );
};

export default TableSkeletonLoading;   