import { useState, useEffect } from 'react';
import { 
  Container, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
  Box
} from '@mui/material';
import { Person } from '@mui/icons-material';
import api from '../utils/axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from '@mui/material/styles';


const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
const skeletonBaseColor = theme.palette.mode === 'dark' ? '#2c2c2c' : '#e6ccff';  // بنفسجي فاتح نهارًا
const skeletonHighlightColor = theme.palette.mode === 'dark' ? '#3d3d3d' : '#f3e6ff';


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

if (loading) {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Company</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton circle width={40} height={40} 
                          baseColor={skeletonBaseColor} 
                          highlightColor={skeletonHighlightColor}
                /></TableCell>
                <TableCell><Skeleton width={100}          
                  baseColor={skeletonBaseColor} 
                  highlightColor={skeletonHighlightColor}/>
                  </TableCell>
                <TableCell><Skeleton width={100} 
                          baseColor={skeletonBaseColor} 
                          highlightColor={skeletonHighlightColor}/>
                          </TableCell>
                <TableCell><Skeleton width={180} 
                          baseColor={skeletonBaseColor} 
                          highlightColor={skeletonHighlightColor}/>
                          </TableCell>
                <TableCell><Skeleton width={120}
                          baseColor={skeletonBaseColor} 
                          highlightColor={skeletonHighlightColor} />
                          </TableCell>
                <TableCell><Skeleton width={140} 
                          baseColor={skeletonBaseColor} 
                          highlightColor={skeletonHighlightColor}/>
                          </TableCell>
                <TableCell><Skeleton width={100} 
                          baseColor={skeletonBaseColor} 
                          highlightColor={skeletonHighlightColor}/>
                          </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}


  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Users
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Website</TableCell>
                <TableCell>Company</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Avatar>
                      <Person />
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.website}</TableCell>
                  <TableCell>{user.company?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Users;