import React, { useState ,useEffect} from 'react';
import { TextField, Avatar,} from "@material-ui/core";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Autocomplete from "@material-ui/lab/Autocomplete";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
const AuthToken = 'rXRs94PQgIRwwV7wxojjeIjDxMU9Tkk3';

const CreateTask = ({modal,toggle,save}) =>{
    const [description , setDescription]= useState('');
    const [taskAssignee , setTaskAssignee]= useState([]);
    const [taskpriority , setTaskPriority]= useState('');
    const priority =[{
                      name :"High",
                      value:3
                    },{
                      name :"Medium",
                      value:2
                    },{   
                      name :"Low",
                      value:1
                    }]
    const [user, setUser] = useState(
       {
              name: taskAssignee.assigned_name,
              picture: taskAssignee.assigned_name,
              id: taskAssignee.assigned_to,
            }
          
      );
      const [selectedDate, setSelectedDate] = useState(
        new Date()
      );
      function handleDateChange(date) {
        setSelectedDate(date);
      }
      function getDueDate() {
        return `${selectedDate.getFullYear()}-${
          selectedDate.getMonth() + 1
        }-${selectedDate.getDate()} 12:12:12`;
      }
    useEffect(() => {
        fetchUsers();
     }, [])

     const fetchUsers = async () => {
        let response = await axios.get("https://devza.com/tests/tasks/listusers", {
           headers: {
             AuthToken,
           },
         });
         setTaskAssignee(response.data.users);       
     };
    const handleChange = (e) => {
        const {value} = e.target
            setDescription(value)        
    }

    function handleAutocomplete(userObj) {
        setUser(userObj);
      }
      function handlePrority(userObj) {
       setTaskPriority(userObj.value)
      }
      
      const handleSave = (e) => {
        e.preventDefault()
        let data = new FormData();
        data.append("message", description);
        data.append("due_date", getDueDate());
        data.append("priority", taskpriority);
        data.append("assigned_to", user.id);  
        save(data)

    }
     
    return(
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Create Task</ModalHeader>
            <ModalBody>
                <form>
                  <div className="form-group">
                  <div className="assignUser">
            {user && <Avatar alt={user.name || "Anon"} src={user.picture} />}
              <Autocomplete
                className="autoComplete"
                options={taskAssignee}
                onChange={(event, userObj, reason) =>
                  handleAutocomplete(userObj)
                }
                getOptionLabel={(option) => option.name}
                size="small"
                style={{ width: 210 }}
                renderInput={(params) => (
                  <TextField {...params} label="Assign to" variant="outlined" />
                )}
              />
          <Autocomplete
                className="autoComplete"
                options={priority}
                onChange={(event, userObj, reason) =>
                  handlePrority(userObj)
                }
                getOptionLabel={(option) => option.name}
                size="small"
                style={{ width: 210 }}
                renderInput={(params) => (
                  <TextField {...params} label="Priority" variant="outlined" />
                )}
              />
          </div>
          <div className ="dateDiv">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                inputVariant="outlined"
                size="small"
                format="yyyy/MM/dd"
                margin="normal"
                label="Due-date"
                value={selectedDate}
                onChange={handleDateChange}
                autoOk={true}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
            </div>
                  </div>
                  <div className="form-group">
                      <label>Description</label>
                      <textarea rows ="5" className="form-control" value={description} onChange={handleChange} name="description"></textarea>
                  </div>
                </form>
            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={handleSave}>Create</Button>
            <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
      </Modal>
    )
}

export default CreateTask;