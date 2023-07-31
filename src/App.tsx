import './App.css'
import axios from "axios";
import {useEffect, useState} from "react";

type Todos = {
    id: string,
    description: string,
    status: string
}

type Status = {
    status: string
}

function FindAll({ status }: Status) {
    const [descriptions, setDescription] = useState<undefined | Todos[]>(undefined);
    useEffect(() => {
        axios({
            method: 'get',
            url: 'api/todo',
        })
            .then(function (response) {
                console.log("GET / READ");
                console.log("Response status: ", response.status);
                console.log("Response data: ", response.data);
                setDescription(response.data.filter((todo: Todos) => todo.status === status));
            })
            .catch(function (error) {
                console.error("Fehler beim Abrufen der Daten:", error);
            });
    }, []);
    console.log("descriptions: ", descriptions);
    return (
        descriptions === undefined || descriptions.length === 0 ? <div>Loading . . .</div> : (
            <ul className="todos-liste">
                {descriptions.map(desc =>
                    <li key={desc.id} className="single-task">
                        <h2>Description: <br/>{desc.description}</h2>
                        <h3 className={"status-text"}>Status: {desc.status}</h3>
                        <button className={"btnNext"} onClick={() => StatusUpdate(desc.id, desc.status)}>next</button>

                    </li>
                )}
            </ul>
        )
    );
}

function StatusUpdate(id: string, currentStatus: string) {
    const updatedStatus = currentStatus === "OPEN" ? "IN_PROGRESS" : "DONE";
    axios({
        method: 'put',
        url: `/api/todo/${id}`,
        data: {
            id: id,
            status: updatedStatus
        }
    }).then(function (response) {
        console.log("PUT / UPDATE");
        console.log("Response status: ", response.status);
        console.log("Response data: ", response.data);
        // Hier könntest du die Todos neu abrufen, um die Änderungen im Frontend zu reflektieren
    });
}


function AddTodo() {
    const [description, setDescription] = useState("")
    const isNotEmpty  = description ==="" ? true : false;

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        axios({
            method: 'post',
            url: '/api/todo',
            data: {
                id: "1",
                description: description,
                status: "OPEN"
            }
        }).then(function (response) {
            console.log("POST / CREATE")
            console.log("Response Status: ", response.status);
            console.log("Response Data: ", response.data)
        })

        setDescription("");
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input className={"inputField"} type={"text"} value={description} onChange={event => setDescription(event.target.value)}/>
                <button disabled={isNotEmpty}>Submit</button>
            </form>
        </div>
    );
}

function App() {
    return (
        <div>
            <div className={"flex-container"}>
                <div className={"addTodo"}>
                    <AddTodo/>
                </div>
                <div className={"item"}>
                    <h1>Offen</h1>
                    <FindAll status="OPEN"/>
                </div>
                <hr/>
                <div className={"item"}>
                    <h1>In progress</h1>
                    <FindAll status="IN_PROGRESS"/>
                </div>
                <hr/>
                <div className={"item"}>
                    <h1>Done</h1>
                    <FindAll status="DONE"/>
                </div>
            </div>
        </div>
    )
}

export default App
