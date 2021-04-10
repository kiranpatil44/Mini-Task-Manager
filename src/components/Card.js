import React, {useState} from 'react';
import EditTask from '../modals/EditTask'
import { TextField, Avatar} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import axios from "axios";
const AuthToken = 'rXRs94PQgIRwwV7wxojjeIjDxMU9Tkk3';
const Card = ({taskObj, index, deleteTask, updateListArray}) => {
    const [modal, setModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(
        new Date()
      );
    
    const userPicture = {        
            "1": "https://images.generated.photos/e9j7MmGzErA8i3bvDhGiZjsdm3RBYAM3vN2NLeNAL8E/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Yz/XzA1NTg4MjYuanBn.jpg",
            "2": "https://images.generated.photos/UwsBYfox5GebeDg4exhGBbmHAS45Zv3bhIpLv8NR1Ug/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Yz/XzAzNTIxMzcuanBn.jpg",
            "3": "https://images.generated.photos/BhXjncNzamfYGsbxydy_gm2ez9qesIf7oQIqpkhMNeA/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Yz/XzA5MzcwNzMuanBn.jpg",
            "4": "https://images.generated.photos/dFS-ATrp2M2GemkZGaRqApn61dCmKbDIMWE14Nx7Zy8/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Yz/XzAzNTk3MzguanBn.jpg",
            "5": "https://images.generated.photos/oO4hnwWAcGN69LKqAUTiL3uKADBoTgo1I0yfmA_V7GM/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Yz/XzA1NjQwNzUuanBn.jpg",
            "6": "https://images.generated.photos/Vw1hR-MUud1_mgTaiteoCryS6i5eVL_ZbAv-EXIwSMA/rs:fit:512:512/Z3M6Ly9nZW5lcmF0/ZWQtcGhvdG9zL3Yz/XzA3OTQ5MDIuanBn.jpg"
          }

    const toggle = () => {
        setModal(!modal);
    }

    async function updateTask (taskObj) {
        let api = "https://devza.com/tests/tasks/update";  
        await axios.post(api, taskObj, {
          headers: {
            AuthToken,
            "Content-Type": "multipart/form-data",
          },
        });  
        setModal(false)
     updateListArray(taskObj, index)
 }
    

    
    const handleDelete = () => {
        deleteTask(taskObj)
    }


    return (
        <div class = "card-wrapper m-2 ">
            <div class = "card-top" style={{"background-color": taskObj.color}}></div>
            <div class = "task-holder">
                <span class = "card-header" style={{"background-color": taskObj.color, "border-radius": "10px"}}>{taskObj.priority}</span>
                <div className="assignUser" style={{marginTop:"10px"}}>
                <TextField
                size="small"
                style={{ width: 150 ,paddingRight:"10px"}}
                label="Assigned to"
                variant="outlined"
                value={taskObj.assignee || "None"}
                disabled={"read"}
              />
              <Avatar src={userPicture[taskObj.id]} />
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
                value={new Date(taskObj.date)}
                autoOk={true}
                disabled={"read"}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
            </div>
            <p className = "mt-3">{taskObj.message}</p>
                <div style={{"position": "absolute", "right" : "20px", "bottom" : "20px"}}>
                    <i class = "far fa-edit mr-3" style={{"color" :taskObj.color, "cursor" : "pointer"}} onClick = {() => setModal(true)}></i>
                    <i class="fas fa-trash-alt" style = {{"color" : taskObj.color, "cursor" : "pointer"}} onClick = {handleDelete}></i>
                </div>
        </div>
        <EditTask modal = {modal} toggle = {toggle} updateTask = {updateTask} taskObj = {taskObj}/>
        </div>
    );
};

export default Card;