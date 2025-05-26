import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import {
  Typography, Box, Grid, Avatar, Card, CardContent,Badge,
  AppBar, Toolbar, Button, IconButton, Drawer, List, ListItem, ListItemText, Tab, Tabs
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { PeopleAlt, Assessment,VerifiedUser, AdminPanelSettings, BarChart, CheckCircle, History } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import logo from "../assets/Image20250320122406.png";
import { Bar } from "react-chartjs-2";
import NotificationsIcon from "@mui/icons-material/Notifications";
import "chart.js/auto"; // Automatically register all components
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Modal from '@mui/material/Modal';

import { PieChart,Pie, Tooltip, Cell, Legend } from "recharts";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
const API_BASE_URL = 'http://127.0.0.1:8000/api';
const COLORS = ["#003366", "#0088FE", "#FFBB28", "#FF8042", "#00C49F"];
const AdminDashboard = () => {
  const [userData, setUserData] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [tests, setTests] = useState([]);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [testData, setTestData] = useState({ name: "", schedule: "", type: "" });
  const [dashboardData, setDashboardData] = useState({});
  const [setUserManagementData] = useState({});
  const [userManagement, setUserManagement] = useState({});
  const [analyticsData, setAnalyticsData] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openNotifications, setOpenNotifications] = useState(false); // New state for notifications modal
  const navigate = useNavigate();

  // Initialize chartData with default values
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Test Completion Rate",
        data: [],
        backgroundColor: "rgba(0, 51, 102, 0.7)",
        borderColor: "#003366",
        borderWidth: 1,
        barThickness: 30,
      },
    ],
  });
  const aggregatedData = tests.reduce((acc, test) => {
    const existing = acc.find((item) => item.name === test.subject);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: test.subject, value: 1 });
    }
    return acc;
  }, []);
  useEffect(() => {
    fetchData(); // Fetch data without checking the user role
  }, []);

  const fetchData = async () => {
      const token = localStorage.getItem('user_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      };

      try {
        const userResponse = await axios.get(`${API_BASE_URL}/userss/`, { headers });
        setUserData(userResponse.data);
        const dashboardResponse = await axios.get(`${API_BASE_URL}/dashboard-overview/`, { headers });
        setDashboardData(dashboardResponse.data);
        const userManagementResponse = await axios.get(`${API_BASE_URL}/user-management-stats/`, { headers });
        setUserManagement(userManagementResponse.data);
        const response = await axios.get(`${API_BASE_URL}/tests-data/`, { headers });
        setAnalyticsData(response.data);

        const [ feedbacksResponse] = await Promise.all([
          
          axios.get(`${API_BASE_URL}/feedbacks/`, { headers }),
        ]);

        setUserManagement(userManagementResponse.data);
        setFeedback(feedbacksResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
      
      }
    };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/tests-management/`);
        setTests(response.data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTests();
  }, []);

  useEffect(() => {
    const fetchCompletionRates = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/test-completion-rates/`);
        const completionRates = response.data;
  
        console.log("Raw API Data:", completionRates);
  
        if (completionRates && typeof completionRates === 'object') {
          const labels = Object.keys(completionRates);
          const data = Object.values(completionRates).map(rate => parseFloat(rate));
  
          // Check if all values are 0 and provide a message
          if (data.every(value => value === 0)) {
            console.log("All data values are 0. Consider adding a visual indicator for this case.");
          }
  
          const formattedData = {
            labels: labels,
            datasets: [
              {
                label: "Test Completion Rate",
                data: data, // Parsed values (which are currently 0)
                backgroundColor: "rgba(0, 51, 102, 0.7)",
                borderColor: "#003366",
                borderWidth: 1,
                barThickness: 30,
              },
            ],
          };
  
          console.log("Formatted Chart Data:", formattedData);
  
          setChartData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching completion rates:", error);
      }
    };
  
    fetchCompletionRates();
  }, []);
  
  // Log chartData when it changes
  useEffect(() => {
    console.log("Chart Data updated:", chartData);
  }, [chartData]);
  
  
  const fetchNotifications = async () => {
    try {

      const userToken = localStorage.getItem("user_token"); // Assuming token is stored in localStorage
      console.log("User token from localStorage:", localStorage.getItem("user_token"));


      const response = await axios.get(`${API_BASE_URL}/admin-notifications/`, {
        headers: {
          Authorization: `Token ${userToken}`, // Adjust if using Bearer token
        },
      });
  
      setNotifications(response.data);
      setUnreadCount(response.data.filter((notif) => !notif.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  // Fetch notifications when the page loads
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleOpenNotifications = async () => {
    setOpenNotifications(true);
    await fetchNotifications(); // Fetch latest notifications
  
    // Mark all notifications as read
    try {
      const userToken = localStorage.getItem("user_token");
  
      await axios.post(
        `${API_BASE_URL}/admin-notifications/mark-read/`, 
        {}, 
        {
          headers: {
            Authorization: `Token ${userToken}`,
          },
        }
      );
  
      // Update unread count to zero
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };
  
  
  const handleCloseNotifications = () => {
    setOpenNotifications(false);
  };
  
  useEffect(() => {
    if (!userData?.id) return; // ✅ Ensure user ID is available

    const userToken = localStorage.getItem("user_token");

    axios
      .get(`${API_BASE_URL}/users/${userData.id}/`, {
        headers: { Authorization: `Token ${userToken}` },
      })
      
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user profile data:", error);
      });
  }, [userData.id]); // ✅ Depend on `userData` to ensure it has been fetched firs
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const userManagementData = [
    {
      label: "Total Users",
      value: userManagement.total_users || 0,
      icon: <PeopleAlt color="primary" sx={{ fontSize: 22 }} />,
    },
    {
      label: "Active Users",
      value: userManagement.active_users || 0,
      icon: <VerifiedUser  color="success" sx={{ fontSize: 22 }} />,
    },
    {
      label: "Admin Users",
      value: userManagement.admin_users || 0,
      icon: <AdminPanelSettings color="warning" sx={{ fontSize: 22 }} />,
    },
    {
      label: "Normal Users",
      value: userManagement.normal_users || 0,
      icon: <PeopleAlt color="secondary" sx={{ fontSize: 22 }} />,
    },
  ];

  const handleSave = () => {
    if (testData.name) {
      setTests(prevTests =>
        prevTests.some(t => t.name === testData.name)
          ? prevTests.map(t => (t.name === testData.name ? testData : t))
          : [...prevTests, testData]
      );
    }
    setOpen(false);
  };

  return (
    <>

      <Drawer open={isSidebarOpen} onClose={toggleSidebar}>
  <Box sx={{ width: 220, textAlign: "center", padding: "12px" }}>
    {isSidebarOpen && (
      <img
        src={logo}
        alt="Logo"
        style={{
          maxWidth: "80%",
          height: "auto",
          marginBottom: "12px",
          borderRadius: "8px",
        }}
      />
    )}
    <List>
    <ListItem sx={{ display: 'flex', justifyContent: 'flex-start' }}>
  <Button
    onClick={() => navigate('/admin-dashboard')}
    sx={{
      color: "#003366", // Dark blue color
      fontWeight: "bold",
      textAlign: "left",
      fontSize: "16px", // Align the text to the left
      width: "100%", // Take up full width of the ListItem
      justifyContent: "flex-start", // Align the button content to the left
    }}
  >
    Dashboard
  </Button>
</ListItem>

<ListItem sx={{ display: 'flex', justifyContent: 'flex-start' }}>
  <Button
    onClick={() => navigate('/testcreation')}
    sx={{
      color: "#003366", // Dark blue color
      fontWeight: "bold",
      textAlign: "left", // Align the text to the left
      width: "100%",
      fontSize: "16px", // Take up full width of the ListItem
      justifyContent: "flex-start", // Align the button content to the left
    }}
  >
    Test Creation
  </Button>
</ListItem>

<ListItem sx={{ display: 'flex', justifyContent: 'flex-start' }}>
  <Button
    onClick={() => navigate('/questioncreation')}
    sx={{
      color: "#003366", // Dark blue color
      fontWeight: "bold",
      fontSize: "16px",
      textAlign: "left", // Align the text to the left
      width: "100%", // Take up full width of the ListItem
      justifyContent: "flex-start", // Align the button content to the left
    }}
  >
    Question Creation
  </Button>
</ListItem>

<ListItem sx={{ display: 'flex', justifyContent: 'flex-start' }}>
  <Button
    onClick={() => navigate('/manage-tests')}
    sx={{
      color: "#003366", // Dark blue color
      fontWeight: "bold",
      fontSize: "16px",
      textAlign: "left", // Align the text to the left
      width: "100%", // Take up full width of the ListItem
      justifyContent: "flex-start", // Align the button content to the left
    }}
  >
    Manage Tests
  </Button>
</ListItem>

<ListItem sx={{ display: 'flex', justifyContent: 'flex-start' }}>
  <Button
    onClick={() => navigate('/announcement')}
    sx={{
      color: "#003366", // Dark blue color
      fontWeight: "bold",
      fontSize: "16px",
      textAlign: "left", // Align the text to the left
      width: "100%", // Take up full width of the ListItem
      justifyContent: "flex-start", // Align the button content to the left
    }}
  >
    Announcements
  </Button>
</ListItem>

<ListItem sx={{ display: 'flex', justifyContent: 'flex-start' }}>
  <Button
    onClick={() => navigate('/adminsettings')}
    sx={{
      color: "#003366", // Dark blue color
      fontWeight: "bold",
      fontSize: "16px",
      textAlign: "left", // Align the text to the left
      width: "100%", // Take up full width of the ListItem
      justifyContent: "flex-start", // Align the button content to the left
    }}
  >
    Settings
  </Button>
</ListItem>

<ListItem sx={{ display: 'flex', justifyContent: 'flex-start' }}>
  <Button
    onClick={() => navigate('/logout')}
    sx={{
      color: "#003366", // Dark blue color
      fontWeight: "bold",
      fontSize: "16px",
      textAlign: "left", // Align the text to the left
      width: "100%", // Take up full width of the ListItem
      justifyContent: "flex-start", // Align the button content to the left
    }}
  >
    Logout
  </Button>
</ListItem>
    </List>
  </Box>
</Drawer>
      <>
      <AppBar position="fixed" sx={{ backgroundColor: "#003366", padding: "6px 16px" }}>
        <Toolbar>
          <IconButton color="inherit" onClick={toggleSidebar} edge="start" sx={{ marginRight: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: "1rem" }}>
            Skill Bridge Online Test Platform
          </Typography>
          <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
          <Button color="inherit" onClick={() => navigate("/admin-profile")}>Admin Profile</Button>
          <Button color="inherit" onClick={() => navigate("/manage-tests")}>Test List</Button>
          <Button color="inherit" onClick={() => navigate("/adminsettings")}>Settings</Button>
          <Button color="inherit" onClick={() => navigate("/logout")}>Logout</Button>

{/* Notification Bell Icon */}
<IconButton color="inherit" onClick={handleOpenNotifications}>
  <Badge badgeContent={unreadCount} color="error">
    <NotificationsIcon />
  </Badge>
</IconButton>
        </Toolbar>
      </AppBar>

      <Modal open={openNotifications} onClose={handleCloseNotifications}>
  <Box sx={{ 
    width: 400, bgcolor: "white", p: 2, position: "absolute", 
    top: "50%", left: "50%", transform: "translate(-50%, -50%)", 
    borderRadius: 2, boxShadow: 24 
  }}>
    <Typography variant="h6" sx={{ mb: 2 }}>Notifications</Typography>
    <List>
      {notifications.length > 0 ? (
        notifications.map((notif, index) => (
          <ListItem key={index} sx={{ borderBottom: "1px solid #ddd" }}>
            <ListItemText primary={notif.message} secondary={new Date(notif.timestamp).toLocaleString()} />
          </ListItem>
        ))
      ) : (
        <Typography variant="body2" sx={{ textAlign: "center" }}>No new notifications</Typography>
      )}
    </List>
    <Button onClick={handleCloseNotifications} fullWidth variant="contained" sx={{ mt: 2 }}>Close</Button>
  </Box>
</Modal>
 </>
        <Box
        component="main"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: 'auto',
          paddingTop: "64px",
          paddingBottom: "80px",
          paddingX: 3,
          boxSizing: 'border-box',
        }}
      >
        <Card sx={{ minWidth: 275, mb: 2, boxShadow: 3, borderRadius: 2, backgroundColor: "#fff" }}>
          <CardContent sx={{ padding: "12px" }}>
            <Typography
              variant="h6"
              color="primary"
              sx={{
                fontWeight: "bold",
                paddingBottom: "8px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <PeopleAltIcon sx={{ fontSize: 20, color: "#003366", marginRight: "8px" }} />
              Admin Overview
            </Typography>

            <Grid container spacing={1} alignItems="center">
            
          <Grid item xs={4} sx={{ textAlign: "center" }}>
            {userData?.profile_picture ? (
              <Avatar
                src={userData.profile_picture}
                alt="Profile"
                sx={{
                  width: 90,
                  height: 90,
                  boxShadow: 2,
                  border: "3px solid #003366",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/150x150"; // ✅ Fallback if image fails to load
                }}
              />
            ) : (
              <Avatar
                src="https://placehold.co/150x150"
                sx={{ width: 90, height: 90 }}
              />
            )}
          </Grid>
          
              <Grid item xs={8}>
                <Box sx={{ paddingLeft: "8px" }}>
                  <Typography variant="body2" sx={{ color: "#003366", fontSize: "19px", marginBottom: "6px" }}>
                    Welcome! To the Admin Dashboard
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={8}>
                <Box sx={{ paddingLeft: "8px" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#003366", marginTop: "4px", fontSize: "26px" }}>
                    {userData?.username || "Admin"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "gray", fontSize: "14px" }}>
                    {userData?.email || "admin@example.com"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
            <Card sx={{width: '100%', mb: 2, boxShadow: 2, borderRadius: 2, backgroundColor: "#fff" }}>
              <CardContent sx={{ padding: "12px" }}>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    borderBottom: "2px solid #003366",
                    paddingBottom: "6px",
                    marginBottom: "10px",
                  }}
                >
                  📊 Dashboard Overview
                </Typography>

                <Grid container spacing={2}>
  {[
    {
      label: "Total Students",
      value: dashboardData?.total_students || "0",
      icon: <PeopleAlt color="primary" sx={{ fontSize: 22 }} />,
    },
    {
      label: "Tests Conducted",
      value: dashboardData?.total_tests || "0",
      icon: <Assessment color="secondary" sx={{ fontSize: 22 }} />,
    },
    {
      label: "Average Score",
      value: `${dashboardData?.average_score != null ? dashboardData.average_score.toFixed(2) : "N/A"}%`,
      icon: <BarChart color="primary" sx={{ fontSize: 22 }} />,
    },
    {
      label: "Completion Rate",
      value: `${dashboardData?.completion_rate != null ? (dashboardData.completion_rate * 100).toFixed(2) : "0"}%`,
      icon: <CheckCircle color="success" sx={{ fontSize: 22 }} />,
    },
    {
      label: "Top Scorers",
      value: dashboardData?.top_scorers && dashboardData.top_scorers.length > 0
        ? dashboardData.top_scorers.map(scorer => `${scorer.user__username} (${scorer.average_score != null ? scorer.average_score.toFixed(2) : "N/A"})`).join(", ")
        : "None",
      icon: <PeopleAlt color="warning" sx={{ fontSize: 22 }} />,
    },
  ].map((item, index) => (
    <Grid item xs={6} key={index}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#f0f8ff",
          borderRadius: 1,
          padding: "8px",
          boxShadow: 1,
        }}
      >
        <Box sx={{ marginRight: "10px" }}>{item.icon}</Box>
        <Box>
          <Typography variant="body2" sx={{ color: "gray" }}>
            {item.label}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold", color: "#003366" }}>
            {item.value}
          </Typography>
        </Box>
      </Box>
    </Grid>
  ))}
</Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card sx={{ width: '100%', mb: 2, boxShadow: 2, borderRadius: 2, backgroundColor: "#fff" }}>
              <CardContent sx={{ padding: "12px" }}>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    borderBottom: "2px solid #003366",
                    paddingBottom: "6px",
                    marginBottom: "10px",
                  }}
                >
 👥 User Management
                </Typography>

                <Grid container spacing={2}>
                  {userManagementData.map((item, index) => (
                    <Grid item xs={6} key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: "#f0f8ff",
                          borderRadius: 1,
                          padding: "8px",
                          boxShadow: 1,
                        }}
                      >
                        <Box sx={{ marginRight: "10px" }}>{item.icon}</Box>
                        <Box>
                          <Typography variant="body2" sx={{ color: "gray" }}>
                            {item.label}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: "bold", color: "#003366" }}>
                            {item.value}
                          </Typography>

                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card sx={{width: '100%', mb: 2, boxShadow: 2, borderRadius: 2, backgroundColor: "#fff" }}>
              <CardContent sx={{ padding: "12px" }}>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    borderBottom: "2px solid #003366",
                    paddingBottom: "6px",
                    marginBottom: "10px",
                  }}
                >

            Test Management
          </Typography>

          {aggregatedData.length > 0 ? (
            <PieChart width={300} height={250}>
              <Pie
                data={aggregatedData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {aggregatedData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              
            </PieChart>
          ) : (
            <Typography sx={{ color: "gray", fontSize: "14px", textAlign: "center" }}>
              No test data available
            </Typography>
          )}

          {/* Dialog for Adding/Editing Tests */}
          <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontSize: "16px" }}>{testData.name ? "Edit Test" : "Add Test"}</DialogTitle>
            <DialogContent>
              <TextField
                label="Test Name"
                fullWidth
                margin="dense"
                size="small"
                value={testData.name}
                onChange={(e) => setTestData({ ...testData, name: e.target.value })}
              />
              <TextField
                label="Schedule"
                fullWidth
                margin="dense"
                size="small"
                value={testData.schedule}
                onChange={(e) => setTestData({ ...testData, schedule: e.target.value })}
              />
              <TextField
                label="Test Type"
                fullWidth
                margin="dense"
                size="small"
                value={testData.type}
                onChange={(e) => setTestData({ ...testData, type: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)} size="small">Cancel</Button>
              <Button onClick={handleSave} variant="contained" size="small">Save</Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} sm={6}>
      <Card sx={{ width: '100%', mb: 2, boxShadow: 2, borderRadius: 2, backgroundColor: "#fff" }}>
        <CardContent sx={{ padding: "12px" }}>
          <Typography
            variant="h6"
            color="primary"
            sx={{
              fontWeight: "bold",
              fontSize: "18px",
              borderBottom: "2px solid #003366",
              paddingBottom: "6px",
              marginBottom: "10px",
            }}
          >
                  📊 Analytics & Reports
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: "center", backgroundColor: "#f0f8ff", borderRadius: 1, padding: "4px", boxShadow: 1 }}>
                      <Typography variant="body2" color="textSecondary">Avg Score</Typography>
                      <Typography variant="body1" color="primary">{analyticsData.average_marks != null ? analyticsData.average_marks.toFixed(2) : "0"}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: "center", backgroundColor: "#f0f8ff", borderRadius: 1, padding: "4px", boxShadow: 1 }}>
                      <Typography variant="body2" color="textSecondary">Highest Score</Typography>
                      <Typography variant="body1" color="secondary">{analyticsData.max_score !== undefined ? analyticsData.max_score : "0"}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: "center", backgroundColor: "#f0f8ff", borderRadius: 1, padding: "4px", boxShadow: 1 }}>
                      <Typography variant="body2" color="textSecondary">Tests Completed</Typography>
                      <Typography variant="body1" color="textPrimary">{analyticsData.total_tests !== undefined ? analyticsData.total_tests : "0"}</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ marginTop: "8px", height: 150 }}>
  <Bar 
    data={chartData} 
    options={{
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000, // 1 second loading animation
        easing: 'easeOutBounce', // bounce effect
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 10, // optional
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => `${context.parsed.y}%`, // show % symbol in tooltip
          },
        },
      },
      hover: {
        mode: 'nearest', // hover nearest bar
        intersect: true,
      },
    }}
    // ✨ ADD this prop to control hover color
    plugins={[{
      id: 'hoverEffect',
      beforeEvent(chart, args) {
        const event = args.event;
        if (event.type === 'mousemove') {
          chart.data.datasets.forEach((dataset) => {
            dataset.backgroundColor = dataset.data.map(() =>
              'rgba(0, 51, 102, 0.7)'
            );
          });
          const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
          if (elements.length) {
            const index = elements[0].index;
            chart.data.datasets.forEach((dataset) => {
              dataset.backgroundColor[index] = 'rgba(0, 51, 102, 1)'; // darker color on hover
            });
          }
          chart.update('none');
        }
      }
    }]}
  />
</Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#003366",
            color: "white",
            padding: "4px",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "white", marginBottom: "2px" }}>
            © {new Date().getFullYear()} Skill Bridge Online Test Platform. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: "2px", marginTop: "2px" }}>
            <IconButton color="inherit" onClick={() => window.open("https://twitter.com", "_blank")}><TwitterIcon /></IconButton>
            <IconButton color="inherit" onClick={() => window.open("https://facebook.com", "_blank")}><FacebookIcon /></IconButton>
            <IconButton color="inherit" onClick={() => window.open("https://instagram.com", "_blank")}><InstagramIcon /></IconButton>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AdminDashboard;