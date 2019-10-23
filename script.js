window.addEventListener("load",function(){
    let todoList = document.getElementById('todo-list');
    let todoForm = document.getElementById('todo-form');
     fetch('http://localhost:3000/todo')
         .then(data => data.json())
         .then(function (data) {
             renderToDoList(data,todoList)
             return data
         })
         .then(function (data) {
             todoForm.addEventListener('submit',function(){
                 addTask(data, todoForm, todoList);
             }, false);
             return data
         })
         .catch(err => console.error(err));
},false);

function renderItem(todoArr, todoItem, listRootEl){
    let li = document.createElement('li');
    li.className = "todo-item";
    li.innerHTML = `
        <input class="checkbox" type="checkbox" ${(todoItem.done)?"checked": "" }>
        <input class="textfield ${(todoItem.done)?"task-done":""}" type="text" value="${todoItem.task}">  
        <button class="delete" >x</button>`;
    listRootEl.append(li);

    let textfield = li.getElementsByClassName('textfield')[0];
    textfield.addEventListener("change",function(){
        editTask(todoArr, todoItem, textfield)
    }, false);

    let deleteBtn = li.getElementsByClassName('delete')[0];
    deleteBtn.addEventListener("click",function(){
        deleteTask(todoArr, todoItem, li)
    }, false);

    let checkbox = li.getElementsByClassName('checkbox')[0];
    checkbox.addEventListener("click",function(){
        checkedTask(todoArr, todoItem, checkbox, textfield)
    }, false);
}

function checkedTask(todoArr, todoItem, taskCheckEl, taskInputEl){
    fetch(`http://localhost:3000/todo/${todoItem.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            done: taskCheckEl.checked
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(function (res) {
            todoArr.forEach(function(item, i, todoArr) {
                if(item.id===todoItem.id){
                    todoArr[i].done = res.done;
                }
            });
             (res.done)?taskInputEl.classList.add("task-done"):
                 taskInputEl.classList.remove("task-done");
            return  res
        })
        .catch(err => console.error(err));
}

function editTask(todoArr, todoItem, taskInputEl){
    fetch(`http://localhost:3000/todo/${todoItem.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            task: taskInputEl.value
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(function (res) {
            todoArr.forEach(function(item, i, todoArr) {
                if(item.id===todoItem.id){
                    todoArr[i].task = res.task;
                }
            });

            return  res
        })
        .catch(err => console.error(err));
}

function renderToDoList(todoArr, listRootEl){
    listRootEl.innerHTML = "";
    for(let i = 0; i < todoArr.length; i++){
        renderItem(todoArr, todoArr[i], listRootEl)
    }
}

function addTask(todoArr, formRootEl, listRootEl){
    let item = {
        done:false,
        task:formRootEl.elements.newTask.value,
        id:0
    };
    fetch('http://localhost:3000/todo',{
        method: 'POST',
        headers: {"Content-Type": "application/json;charset=UTF-8"},
        body: JSON.stringify(item)})
        .then(res => res.json())
        .then(function(res){
            todoArr.push(res);
            renderItem(todoArr, res, listRootEl);
            return res
        })
        .catch(err => console.error(err));
}

function deleteTask(todoArr, todoItem, itemRootEl){

    fetch(`http://localhost:3000/todo/${todoItem.id}`,{
        method: 'DELETE',
        headers: {"Content-Type": "application/json;charset=UTF-8"}})
        .then(res => res.json())
        .then(function (res) {
            todoArr.forEach(function(item, i, todoArr) {
                if(item.id===todoItem.id){
                    todoArr.splice(i, 1);
                }
            });
            itemRootEl.remove();
            return  res
        })
        .catch(err => console.error(err));
}