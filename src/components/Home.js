import React,{useState,useEffect} from 'react';
import CreateTask from '../modals/CreateTask';
import Card from './Card'
import Logo from "../assets/devza_logo.png";
import Search from "../components/Search";
import axios from "axios";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

const AuthToken = 'rXRs94PQgIRwwV7wxojjeIjDxMU9Tkk3';

const Home = () =>{
    const [modal, setModal] = useState(false);
    const [taskList, setTaskList] = useState([]);
    const [highPriorityTasks, setHighPriorityTasks] = useState([]);
    const [mediumPriorityTasks, setMediumPriorityTasks] = useState([]);
    const [lowPriorityTasks, setLowPriorityTasks] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    
    const toggle = () => setModal(!modal);
     
    useEffect(() => {
      fetchData();
       
    }, [])
   const fetchData = async () => {
        let response = await axios.get("https://devza.com/tests/tasks/list", {
          headers: {
            AuthToken,
          },
        });
        var tasks = [];  
            for ( var i=0 ; i<response.data.tasks.length;i++) {
                var color;
                var priority;
                switch(response.data.tasks[i].priority) {
                    case "1" :
                        color = "#ffcc00";
                        priority="Low Priority";
                      break;
                    case "2" :
                        color =  "#009933";
                        priority="Medium Priority" ;
                      break;
                      case "3" :
                        color = "#cc0000";
                        priority="High Priority";
                      break;
                    default:
                      // code block
                  }
                tasks.push(
              {    
        task_id :response.data.tasks[i].id,             
        priority: priority,
        priority_id: response.data.tasks[i].priority,
        date: new Date(response.data.tasks[i].due_date) ,
        assignee: response.data.tasks[i].assigned_name,
        id: response.data.tasks[i].assigned_to,
        message: response.data.tasks[i].message,
        color: color
              })
            }
        setTaskList(tasks)
        getTasksByPriority(tasks)
   }
  const getTasksByPriority = (dataArray) => {
    console.log("high priority dataArray"+ JSON.stringify(dataArray))

    let highPriorityTasks  = dataArray.filter((task) => task.priority_id ==="3");
    let mediumPriorityTasks = dataArray.filter((task) => task.priority_id === "2");
    let lowPriorityTasks = dataArray.filter((task) => task.priority_id === "1");
    setHighPriorityTasks(highPriorityTasks);
    setMediumPriorityTasks(mediumPriorityTasks);
    setLowPriorityTasks(lowPriorityTasks);
  };

        async function deleteTask(obj) {
            let data = new FormData();
            data.append("taskid", obj.task_id);
        
            await axios.post("https://devza.com/tests/tasks/delete", data, {
              headers: {
                AuthToken,
                "Content-Type": "multipart/form-data",
              },
            });
            fetchData();
       
          }
    

    const updateListArray = (obj, index) => {
        fetchData();
    }
  

        async function saveTask (taskObj) {
            let api = "https://devza.com/tests/tasks/create";  
            await axios.post(api, taskObj, {
              headers: {
                AuthToken,
                "Content-Type": "multipart/form-data",
              },
            });  
         setModal(false);
         fetchData();
     }

   const filterTasksBySearch = (input) => {
       
    
        let sortedBySearch = taskList.filter(
          (task) => task.message.toLowerCase().indexOf(input.toLowerCase()) > -1 || task.assignee.toLowerCase().indexOf(input.toLowerCase()) > -1
        );
         setSearchInput(input)
        //this.setState({ searchInput: input, selectedUser: "" });
        getTasksByPriority(sortedBySearch);
      };

    const onDragEnd = async (result) => {
      
        }
    
    return(
        <DragDropContext onDragEnd={onDragEnd}>
        <div>
        <div className="header">
        <div className="board">      
        <img className="logo" alt="Devza" src={Logo} />
                <Search input={searchInput} setInput={filterTasksBySearch} />
        <button className="btn btn-primary mt-2" onClick={()=> setModal(true)}>Create Task</button>
        </div>
       </div>
       <div className="task-container">
           <div className="mainDiv">
           {highPriorityTasks && highPriorityTasks.map((obj,index)=>{
         return <Card taskObj ={obj} index={index} deleteTask ={deleteTask} updateListArray={updateListArray}/>
         })}
         </div>
         <div className="mainDiv">  {mediumPriorityTasks && mediumPriorityTasks.map((obj,index)=>{
         return <Card taskObj ={obj} index={index} deleteTask ={deleteTask} updateListArray={updateListArray}/>
         })}</div>
          <div className="mainDiv">
           {lowPriorityTasks && lowPriorityTasks.map((obj,index)=>{
         return <Card taskObj ={obj} index={index} deleteTask ={deleteTask} updateListArray={updateListArray}/>
         })}
        </div>
       </div>
       <CreateTask toggle={toggle} modal={modal} save = {saveTask}/>
       </div>
       </DragDropContext>
    )
}

export default Home;