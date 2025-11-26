import TaskRepository from "../../repositories/task.repository.js";
import TaskService from "../../services/task.service.js";
import { CreateTaskDTO, UpdateTaskDTO } from "../../dtos/task.dto.js";

const repo = new TaskRepository();
const taskService = new TaskService();

export const renderDashboard = async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  
  const tasks = await repo.findAll();
  res.render("dashboard", { user: req.session.user, tasks });
};

export const renderTaskCreate = (req, res) => {
  res.render("tasks/create", { title: "Criar Tarefa", error: null, user: req.session?.user });
};

export const renderTaskDetails = async (req, res) => {
  const task = await repo.findById(req.params.id);
  if (!task) {
    return res.redirect("/dashboard");
  }
  res.render("tasks/details", { title: "Detalhes da Tarefa", task, user: req.session?.user });
};

export const renderTaskEdit = async (req, res) => {
  const task = await repo.findById(req.params.id);
  if (!task) {
    return res.redirect("/dashboard");
  }
  res.render("tasks/edit", { title: "Editar Tarefa", task, error: null, user: req.session?.user });
};

export const createTaskView = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    let processedDueDate = null;
    if (dueDate && typeof dueDate === 'string' && dueDate.trim() !== "") {
      const [year, month, day] = dueDate.split('-').map(Number);
      processedDueDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
      if (isNaN(processedDueDate.getTime())) {
        processedDueDate = null;
      }
    }

    const dto = new CreateTaskDTO({
      title,
      description,
      status: status || "pending",
      dueDate: processedDueDate,
      userId: req.session.user.id.toString(),
    });

    await taskService.createTask(dto);
    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.render("tasks/create", { 
      title: "Criar Tarefa", 
      error: err.message || "Erro ao criar tarefa",
      user: req.session?.user
    });
  }
};

export const updateTaskView = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const { id } = req.params;
    
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    let processedDueDate = null;
    if (dueDate && typeof dueDate === 'string' && dueDate.trim() !== "") {
      const [year, month, day] = dueDate.split('-').map(Number);
      processedDueDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
      if (isNaN(processedDueDate.getTime())) {
        processedDueDate = null;
      }
    } else if (dueDate && typeof dueDate !== 'string') {
      processedDueDate = dueDate;
    }

    const dto = new UpdateTaskDTO({
      title,
      description,
      status,
      dueDate: processedDueDate,
    });

    const currentUser = {
      id: req.session.user.id.toString(),
      role: req.session.user.role || "user",
    };

    await taskService.updateTask(id, dto, currentUser);
    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    const task = await repo.findById(req.params.id);
    return res.render("tasks/edit", { 
      title: "Editar Tarefa", 
      task,
      error: err.message || "Erro ao atualizar tarefa",
      user: req.session?.user
    });
  }
};

export const deleteTaskView = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    const currentUser = {
      id: req.session.user.id.toString(),
      role: req.session.user.role || "user",
    };

    await taskService.deleteTask(id, currentUser);
    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.redirect("/dashboard");
  }
};