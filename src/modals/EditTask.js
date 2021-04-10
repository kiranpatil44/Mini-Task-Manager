import React, { useState ,useEffect} from 'react';
import { TextField, Avatar } from "@material-ui/core";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Autocomplete from "@material-ui/lab/Autocomplete";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
const AuthToken = 'rXRs94PQgIRwwV7wxojjeIjDxMU9Tkk3';

const EditTaskPopup = ({modal, toggle, updateTask, taskObj}) => {
    const [description, setDescription] = useState(taskObj.message);
    const [taskAssignee , setTaskAssignee]= useState([]);
    const [taskpriority , setTaskPriority]= useState('');
    const userPicture = {        
        "1": "https://images.generated.photos/e9j7MmGzErA8i3bvDhGiZjsdm3RBYAM3vN2NLeNAL8E/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Yz/XzA1NTg4MjYuanBn.jpg",
        "2": "https://images.generated.photos/UwsBYfox5GebeDg4exhGBbmHAS45Zv3bhIpLv8NR1Ug/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Yz/XzAzNTIxMzcuanBn.jpg",
        "3": "https://images.generated.photos/BhXjncNzamfYGsbxydy_gm2ez9qesIf7oQIqpkhMNeA/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Yz/XzA5MzcwNzMuanBn.jpg",
        "4": "https://images.generated.photos/dFS-ATrp2M2GemkZGaRqApn61dCmKbDIMWE14Nx7Zy8/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Yz/XzAzNTk3MzguanBn.jpg",
        "5": "https://images.generated.photos/oO4hnwWAcGN69LKqAUTiL3uKADBoTgo1I0yfmA_V7GM/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Yz/XzA1NjQwNzUuanBn.jpg",
        "6": "https://images.generated.photos/Vw1hR-MUud1_mgTaiteoCryS6i5eVL_ZbAv-EXIwSMA/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Yz/XzA3OTQ5MDIuanBn.jpg"
      }
    const [user, setUser] = useState(
       {
              name: taskAssignee.assigned_name,
              picture: userPicture[taskObj.id],
              id: taskAssignee.assigned_to,
            }
          
      );
      const priority =[
        {
            name :"Low",
            value:1
           },
           {
 
            name :"Medium",
            value:2
         },
          {
        name :"High",
        value:3
     },
 ]

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

    },[])
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
    const handleUpdate = (e) => {
        e.preventDefault();
        let data = new FormData();
        data.append("message", description);
        data.append("due_date", getDueDate());
        data.append("priority", taskpriority);
        data.append("assigned_to", user.id);  
        data.append("taskid", taskObj.task_id);
        updateTask(data)
    }
    
    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Update Task</ModalHeader>
            <ModalBody>
            
                    <div className = "form-group">
                    <div className="assignUser">
            {user && <Avatar alt={user.name || "Anon"} src={user.picture} />}
              <Autocomplete
                className="autoComplete"
                options={taskAssignee}
                format="yyyy/MM/dd"
                onChange={(event, userObj, reason) =>
                  handleAutocomplete(userObj)
                }
                defaultValue={taskAssignee[taskObj.id-1]}
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
                defaultValue={priority[taskObj.priority_id-1]}
                getOptionLabel={(option) => option.name}
                size="small"
                style={{ width: 210 }}
                renderInput={(params) => (
                  <TextField {...params} label="Priority" variant="outlined" />
                )}
              />
          </div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                inputVariant="outlined"
                size="small"
                format="yyyy/MM/dd"
                margin="normal"
                label="Due-date"
                value={taskObj.date}
                onChange={handleDateChange}
                autoOk={true}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
                    </div>
                    <div className = "form-group">
                        <label>Description</label>
                        <textarea rows = "5" className = "form-control" value = {description} onChange = {handleChange} name = "description"></textarea>
                    </div>
                
            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={handleUpdate}>Update</Button>{' '}
            <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
      </Modal>
    );
};

export default EditTaskPopup;