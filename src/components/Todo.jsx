import React from 'react'

export const Todo = () => {
    const [input, setInput] = React.useState('');
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [page,setPage] = React.useState(1);
    const [totalItem,setTotalItem] = React.useState(0);

    React.useEffect(()=>{
        fetchAndUpdateData();
    },[page])

    const fetchAndUpdateData = () => {
        setLoading(true);
        fetch(`http://localhost:8080/tasks?_page=${page}&_limit=3`)
            .then((res)=>{
                let total = res.headers.get("X-Total-Count");
                setTotalItem(+total);
                return res.json()
            })
            .then((res)=>setData(res))
            .catch((err)=>setError(true))
            .finally(()=>setLoading(false))
    }

    const addTodo = () =>{
        const payload = {
            title:input,
            status:false,
        };
        const dataToPost = JSON.stringify(payload);
        
        fetch(`http://localhost:8080/tasks`,{
            method:"POST",
            body:dataToPost,
            headers: {
                "Content-Type":"application/json"
            }
        }).then(()=>{
            fetchAndUpdateData();
            setInput("")    
        })
    }


    return (
        <div>
            <input type="text" placeholder='Add todo' value={input} onChange={(e) => setInput(e.target.value)} />
            <button onClick={addTodo}>Add</button>
            <hr />
            {
                loading ? (<h1>Loading.....</h1>
                ) : error ? (<h1>Something went Wrong.....</h1>
                ) : (data.map((el)=>{
                    return <p>{el.title}</p>
                }))
            }
            <div>
            <button disabled={page===1} onClick={()=>{setPage(page-1)}}>Prev</button>
            <button disabled={page===Math.ceil(totalItem/3)} onClick={()=>{setPage(page+1)}}>Next</button>
            </div>
        </div>
    )
}
