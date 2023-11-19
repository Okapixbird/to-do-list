const list_container = document.querySelector('[list-container]');
const add_new_list = document.querySelector('[add_new_list]')
const new_list_input = document.querySelector('[new_list_value]')
const delete_list = document.querySelector('[delete-list]')
const task_container = document.querySelector('[task-container]')
const task_count_number = document.querySelector('[task-count-number]')
const task_display_container = document.querySelector('[data-list-display-container]')
const list_task_name = document.querySelector('[list-task-name]')
const add_new_task = document.querySelector('[add-new-task]')
const new_task_input = document.querySelector('[add-new-input-task')
const delete_task = document.querySelector('[delete-task]')

let LOCAL_STORAGE_LIST_KEY = 'task.lists'
let LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selected_list_id'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selected_list_id = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

///gobal functions
function create_list(name){
    return{ id: Date.now().toString(), name: name, task: []}
}
function create_task(name){
    return{ id: Date.now().toString(), name: name, complete: false}
}
function save(){
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selected_list_id)
}
function save_and_render(){
    save()
    render()
}
function clear_first_child(x){
    while(x.firstChild){
        x.removeChild(x.firstChild)
    }
}
///list
function render_list(){
    lists.forEach(list=>{
        const list_element = document.createElement('li')
        list_element.classList.add('name-list');
        list_element.dataset.listId = list.id
        list_element.innerText = list.name
        if(list.id === selected_list_id){
            list_element.classList.add('active-list')
        }
        list_container.appendChild(list_element)
    })
}
add_new_list.addEventListener('click', e=>{
    e.preventDefault()
    const list_name = new_list_input.value;
    if(list_name == null || list_name === '') return;
    const new_list = create_list(list_name)
    new_list_input.value= null
    lists.push(new_list)
    save_and_render()
    console.log(new_list)
})
list_container.addEventListener('click', e=>{
    if(e.target.tagName.toLowerCase() === 'li'){
        selected_list_id = e.target.dataset.listId
        save_and_render()
    }
})
delete_list.addEventListener('click', e=>{
    lists = lists.filter(list=> list.id !== selected_list_id);
    selected_list_id = null
    save_and_render()
})
///tasks
function render_task(selected_list){
    selected_list.task.forEach(task=>{
        const task_element = document.createElement('li')
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox';
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = document.createElement('label')
        label.textContent = task.name;
        task_element.appendChild(checkbox)
        task_element.appendChild(label)
        task_container.appendChild(task_element)
    })
}
function task_count(selected_list){
    const incompletetask = selected_list.task.filter(task => !task.complete).length
    const taskString = incompletetask === 1 ? 'task' : 'tasks'
    task_count_number.innerText = `${incompletetask} ${taskString} remaining`
}
add_new_task.addEventListener('click', e=>{
    e.preventDefault()
    const task_name = new_task_input.value;
    if(task_name == null || task_name === '') return
    const new_task = create_task(task_name)
    new_task_input.value = null;
    const selected_list = lists.find(list => list.id === selected_list_id)
    selected_list.task.push(new_task)
    save_and_render()
})
task_container.addEventListener('click', e=>{
    if(e.target.tagName.toLowerCase() === 'input'){
        const selected_list = lists.find(list => list.id === selected_list_id)
        const selected_task = selected_list.task.find(task => task.id === e.target.id)
        selected_task.complete = e.target.checked
        save()
        task_count(selected_list)
    }
})
delete_task.addEventListener('click', e=>{
    const selected_list = lists.find(list => list.id === selected_list_id)
    selected_list.task = selected_list.task.filter(task => !task.complete)
    save_and_render()
})
///render
function render(){
    clear_first_child(list_container)
    render_list()
    const selected_list = lists.find(list=> list.id === selected_list_id)
    if(selected_list_id == null){
        task_display_container.style.display = 'none'
    }else{
        task_display_container.style.display = '';
        list_task_name.innerText = selected_list.name
        task_count(selected_list)
        clear_first_child(task_container)
        render_task(selected_list)
    }
}
render()