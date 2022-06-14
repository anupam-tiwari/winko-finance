import React, { useState, useEffect, useRef } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import axios from "axios"

const baseURL = "https://winko-server.herokuapp.com/finance/";

export default function Dashboard() {
  const transferAmount = useRef(99); 
  const transferTo = useRef(); 
  const [error, setError] = useState("")
  const [account, setAccount] = useState("")

  const { currentUser, logout } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  useEffect(() => {
    axios.get(baseURL + `${currentUser.email}`).then((response) => {
      setAccount(response.data);
    });
  }, []);

  function makeTXN(){
     deduct(); 
     add(); 
  }

  async function deduct(){
    console.log(transferAmount.current.value);
    try{
      await axios.put(baseURL + "deduct/" + `${currentUser.email}`, {amount: transferAmount.current.value}).then((response) => {
        console.log(response)
      }); 
    }catch(e){
      console.log(e)
    }
    
    //console.log(transferAmount.current.value)
  }

  async function add(){
    try{
      await axios.put(baseURL + "add/" + `${transferTo.current.value}`, {amount: transferAmount.current.value}).then((response) => {
        console.log(response)
      }); 
    }catch(e){
      console.log(e)
    }
  }


  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {currentUser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <h1>User info</h1>
          <h3>User balance: {account.balance}</h3>
          
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <form>
            <input type="number" ref={transferAmount} placeholder="Tranfer Amount"></input>
            <input type="string" ref={transferTo} placeholder="Transfer to"></input>
            <input type="button" onClick={makeTXN} value="Transfer"></input>
          </form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </>
  )
}
