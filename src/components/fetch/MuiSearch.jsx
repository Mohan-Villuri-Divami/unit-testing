import { useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const MuiSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const fetchData = async (term) => {
    if (!term) return;

    try {
      const response = await fetch(
        `https://mocki.io/v1/0f4eeff2-797f-4450-b11d-d630b112e553?search=${term}`
      );

      if (!response.ok) {
        throw new Error("Fetch failed or returned a non-ok response");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setSearchResults(data);
      } else {
        console.error("Expected data to be an array, but got:", typeof data);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setSearchResults([]);
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    fetchData(searchTerm);
  };

  const filteredData = searchResults.filter(
    (row) => row.id === parseInt(searchTerm, 10)
  );

  return (
    <Box>
      <TextField
        label="Search by ID"
        variant="outlined"
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSearch();
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {searchResults.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Date of Birth</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.Name}</TableCell>
                  <TableCell>{row.Role}</TableCell>
                  <TableCell>{row.class}</TableCell>
                  <TableCell>{row.Gender}</TableCell>
                  <TableCell>{row.DateOfBirth}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box>No data available</Box>
      )}
    </Box>
  );
};

export default MuiSearch;
