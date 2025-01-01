import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  InputAdornment,
  TextField,
  Paper,
  Avatar,
  Divider,
  useTheme,
  Chip
} from '@mui/material';
import {
  GitHub,
  Storage,
  Cloud,
  Search,
  CloudQueue,
  Timeline,
  People,
  ArrowUpward,
  Speed
} from '@mui/icons-material';

const MainDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const platforms = [
    {
      id: 1,
      name: 'GitHub',
      icon: <GitHub />,
      description: 'Repository and team access management',
      activeUsers: 45,
      trend: '+12%',
      bgColor: '#24292e',
      color: '#ffffff',
      route: '/github',
      status: 'Active'
    },
    {
      id: 2,
      name: 'MongoDB',
      icon: <Storage />,
      description: 'Database access control and user permissions',
      activeUsers: 32,
      trend: '+8%',
      bgColor: '#13aa52',
      color: '#ffffff',
      route: '/mongodb',
      status: 'Coming Soon'
    },
    {
      id: 3,
      name: 'AWS',
      icon: <Cloud />,
      description: 'Deployement and Database',
      activeUsers: 32,
      trend: '+8%',
      bgColor: '#13aa52',
      color: '#ffffff',
      route: '/mongodb',
      status: 'Coming Soon'
    }
    // ... other platforms remain same but add trend and status
  ];

  const filteredPlatforms = platforms.filter(platform =>
    platform.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlatformClick = (platform) => {
    if (platform.name === 'GitHub') {
      navigate(platform.route);
    } else {
      alert(`${platform.name} integration coming soon!`);
    }
  };

  return (
    <Box sx={{ 
      bgcolor: theme.palette.grey[50], 
      minHeight: '100vh',
      pt: 3,
      pb: 6
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}>
          <Box>
            <Typography 
              variant="h5" 
              component="h1" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.grey[900]
              }}
            >
              Platform Dashboard
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.grey[600],
                mt: 0.5 
              }}
            >
              Manage your organization's platform access in one place
            </Typography>
          </Box>

          {/* Search Bar */}
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search platforms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              width: { xs: '100%', sm: '280px' },
              bgcolor: 'white',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.grey[200],
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.grey[300],
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: theme.palette.grey[400] }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { 
              icon: <Speed />, 
              title: 'Total Platforms', 
              value: platforms.length,
              color: theme.palette.primary.main 
            },
            { 
              icon: <People />, 
              title: 'Active Users',
              value: platforms.reduce((sum, p) => sum + p.activeUsers, 0),
              color: theme.palette.success.main
            },
            { 
              icon: <Timeline />, 
              title: 'Total Integrations',
              value: platforms.length * 2,
              color: theme.palette.warning.main
            }
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                elevation={0}
                sx={{ 
                  border: `1px solid ${theme.palette.grey[200]}`,
                  height: '100%'
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: `${stat.color}15`,
                        color: stat.color,
                        width: 46,
                        height: 46
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.palette.grey[600],
                          fontWeight: 500
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          color: theme.palette.grey[900]
                        }}
                      >
                        {stat.value.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Platforms Grid */}
        <Grid container spacing={3}>
          {filteredPlatforms.map((platform) => (
            <Grid item xs={12} sm={6} md={4} key={platform.id}>
              <Card 
                elevation={0}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  border: `1px solid ${theme.palette.grey[200]}`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                    borderColor: 'transparent'
                  }
                }}
                onClick={() => handlePlatformClick(platform)}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: platform.bgColor,
                          color: platform.color,
                          width: 40,
                          height: 40
                        }}
                      >
                        {platform.icon}
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 600,
                            color: theme.palette.grey[900]
                          }}
                        >
                          {platform.name}
                        </Typography>
                        <Chip
                          label={platform.status}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.75rem',
                            bgcolor: platform.status === 'Active' 
                              ? `${theme.palette.success.main}15`
                              : `${theme.palette.grey[500]}15`,
                            color: platform.status === 'Active'
                              ? theme.palette.success.main
                              : theme.palette.grey[600],
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                        />
                      </Box>
                    </Box>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 0.5,
                        color: theme.palette.success.main
                      }}
                    >
                      <ArrowUpward sx={{ fontSize: 14 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {platform.trend}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.grey[600],
                      mb: 2,
                      minHeight: 40
                    }}
                  >
                    {platform.description}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <People sx={{ fontSize: 16, mr: 1, color: theme.palette.grey[400] }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.grey[600],
                        fontWeight: 500
                      }}
                    >
                      {platform.activeUsers.toLocaleString()} active users
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MainDashboard;