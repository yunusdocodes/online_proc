import { useEffect,useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios"; 

const PreTestForm = () => {
  const { uuid } = useParams();// Changed testId → secureId
  const [testId, setTestId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (uuid) {
      axios.get(`http://127.0.0.1:8000/api/decode-test-uuid/${uuid}/`)
        .then(res => {
          setTestId(res.data.test_id);
        })
        .catch(err => {
          console.error("Failed to decode test ID", err);
        });
    }
  }, [uuid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userData = {
      name,
      email,
      test_id: testId,
    };
  
    try {

      if (!localStorage.getItem("userToken")) {
        const response = await fetch("http://127.0.0.1:8000/api/test-users/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      
        const data = await response.json();
      
        if (response.ok) {
          if (data.token) {
            localStorage.setItem('userToken', data.token);
          }
          navigate(`/smartbridge/online-test-assessment/${uuid}/instructions/`);
        } else {
          alert(data.message || "You are not allowed to take this test.");
        }
      } else {
        navigate(`/smartbridge/online-test-assessment/${uuid}/instructions/`);
      }
      
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };
  

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f4f6f8">
      <Card sx={{ width: 350, p: 2, boxShadow: 3, borderRadius: 2 }}>
        <CardHeader 
          title="Enter Your Details" 
          sx={{ textAlign: "center", color: "#1565c0", fontWeight: "bold" }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField 
              label="Name" 
              variant="outlined" 
              fullWidth 
              margin="normal" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField 
              label="Email" 
              type="email" 
              variant="outlined" 
              fullWidth 
              margin="normal" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mt: 2, py: 1.5 }}
            >
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PreTestForm;